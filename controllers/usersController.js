const factory = require('./handlerFactory');
const User = require("../models/userModel");

//const catchAysnc = require("../utlis/catchAysnc");
exports.getMe = (req, res, next) => {
    req.params.id = req.user.id;
    next();
}


exports.createUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not defined! Please use /signup instead'
    });
};
exports.getUser = factory.getOne(User);
exports.getAllUsers = factory.getAll(User);

// not use, use update
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);
