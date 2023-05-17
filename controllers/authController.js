const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const User = require('../models/userModel');
const AppError = require('../utlis/appError');
const catchAysnc = require('../utlis/catchAysnc');
const sendEmail = require('../utlis/email');

const signToken = function (id) {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
}
exports.singup = catchAysnc(async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        passwordChangeAt: req.body.passwordChangeAt,
        role: req.body.role
    });

    const token = signToken(newUser._id);

    res.status(201).json({
        status: 'success',
        token,
        data: {
            user: newUser
        }
    });
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
    const token = signToken(user._id);
    res.status(200).json({
        status: 'success',
        token
    });
});
exports.protect = catchAysnc(async (req, res, next) => {
    // Getting token and check of it's there ?
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    };
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
    const token = signToken(user._id);
    res.status(200).json({
        status: 'success',
        token
    });
});