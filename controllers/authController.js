const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const User = require('../models/userModel');
const AppError = require('../utlis/appError');
const catchAysnc = require('../utlis/catchAysnc');
const sendEmail = require('../utlis/email');

const cookieOptions = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
    httpOnly: true
};
if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
const signToken = function (id) {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
};

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user.id);
    // remove password form output
    user.password = undefined;
    res.cookie('jwt', token, cookieOptions);
    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user
        }
    })
};

const filterObj = (Obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(Obj).forEach(el => {
        if (allowedFields.includes(el)) {
            newObj[el] = Obj[el];
        }
    });
    return newObj;
};

exports.singup = catchAysnc(async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        passwordChangeAt: req.body.passwordChangeAt,
        role: req.body.role
    });
    createSendToken(newUser, 201, res);
});
exports.login = catchAysnc(async (req, res, next) => {
    const { email, password } = req.body;
    // 1. check first email or password  exist ?
    if (!email || !password) return next(new AppError('please provied a email or password!', 400));
    // 2. check user exist && password is correct ?  
    const user = await User.findOne({ email }).select('+password');
    //const correct = await user.correctPassword(password, user.password);
    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('Incorrect email or password', 401))
    };
    // 3. if everything is ok . sent token to client
    createSendToken(user, 200, res);
});
exports.logout = (req, res) => {
    res.cookie('jwt', 'no-token-here', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });
    res.status(200).json({ status: 'success' });
};
exports.protect = catchAysnc(async (req, res, next) => {
    // Getting token and check of it's there ?
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
        token = req.cookies.jwt
    }

    if (!token) {
        return next(
            new AppError('You are not login! please login first to visit this site', 401)
        );
    };
    // verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    //check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
        return next(new AppError('The user belonging to this token does no longer exist!', 401));
    }
    // check if user change the password after token was the issued 
    if (currentUser.changePasswordAfter(decoded.iat)) {
        return next(new AppError('Your Password Change Recently! please try again!', 401));
    }
    // access protected route
    req.user = currentUser;
    next();
});
exports.restrictTo = function (...roles) {
    return function (req, res, next) {
        if (!roles.includes(req.user.role)) {
            return next(new AppError('You do not have permission to perform this action', 403));
        }
        next();
    }
};

exports.forgotPassword = catchAysnc(async (req, res, next) => {
    // 1) get user based on posted email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new AppError('There are no User with that Email !!!', 404))
    }
    // 2) create randon reset token
    const resetToken = user.createPasswordResetToken();

    await user.save({ validateBeforeSave: false });

    // 3) send  it to user's email
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/resetPassword/${resetToken}`
    const message = `Forgot your password! submit a PATCH request with new password and COMFIRM PASSWORD to:${resetUrl}\n if you did't forget your password ignore this email`

    try {
        await sendEmail({
            email: user.email,
            subject: 'Your PASSWORD Reset Token! (valid for 10m)',
            message
        })

        res.status(200).json({
            status: 'success',
            message: 'Your token sent to email'
        });
    } catch (err) {
        user.passwordResetToken = undefined;
        user.resetTokenExpire = undefined;
        await user.save({ validateBeforeSave: false });
        return next(new AppError('There was an error sending the email ! try again latter !', 500));
    }
});

exports.resetPassword = catchAysnc(async (req, res, next) => {
    // 1 ) get user based on token
    const hashToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({
        passwordResetToken: hashToken,
        resetTokenExpire: { $gt: Date.now() }
    });
    // 2 ) if token has not expire, and there is user, set the new password
    if (!user) return next(new AppError('Token is invalid or has expires', 400));
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.resetTokenExpire = undefined;
    await user.save();
    // 3 ) update changePasswordAt property for the user
    // solve => check user Schema pre hook 👍 
    // 4 ) log the user in, send jwt
    createSendToken(user, 200, res);
});
exports.updateMyPassword = catchAysnc(async (req, res, next) => {
    // 1. get user from USER collections
    const user = await User.findById(req.user.id).select('+password');
    // 2. check if posted current password is correct
    if (!await user.correctPassword(req.body.currentPassword, user.password)) {
        return next(new AppError('Current password is incorrect.', 401));
    }
    // 3. if so, update  password
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();
    // 4. loged user in, send jwt token
    createSendToken(user, 200, res);
});
exports.updateMe = catchAysnc(async (req, res, next) => {
    // check if user posted Password DATA 
    if (
        req.body.password ||
        req.body.passwordConfirm)
        return next(new AppError("This route not for password update! Please use /updateMyPassword.", 400));
    // update data
    const filteredBody = filterObj(req.body, 'name', 'email');
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, { new: true, runValidators: true });
    createSendToken(updatedUser, 200, res);
});
exports.deleteMe = catchAysnc(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, { active: false });

    res.status(204).json({
        status: 'deleted',
        data: null
    });
});
// ONly for render pages. no erros!

exports.isLoggedIn = async (req, res, next) => {
    if (req.cookies.jwt) {
        try {
            // verification token
            const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);
            //check if user still exists
            const currentUser = await User.findById(decoded.id);
            if (!currentUser) {
                return next();
            }
            // check if user change the password after token was the issued 
            if (currentUser.changePasswordAfter(decoded.iat)) {
                return next();
            }
            // there is a logged in user
            res.locals.user = currentUser;
            return next()
        } catch (err) {
            return next()
        }
    }
    next();
};