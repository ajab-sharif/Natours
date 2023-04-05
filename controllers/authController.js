const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAysnc = require('../utlis/catchAysnc');
const appError = require('../utlis/appError');
const AppError = require('../utlis/appError');

const signToken = function (id) {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
}
exports.singup = catchAysnc(async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
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
exports.login = async (req, res, next) => {
    const { email, password } = req.body;
    // 1. check first email or password  exist ?
    if (!email || !password) return next(new AppError('please provied a email or password!', 400));
    // 2. check user exist && password is correct ?  
    const user = await User.findOne({ email }).select('+password');
    //const correct = await user.correctPassword(password, user.password);
    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(appError('Incorrect email or password', 401))
    };
    // 3. if everything is ok . sent token to client
    const token = signToken(user._id);
    res.status(200).json({
        status: 'success',
        token
    });
}