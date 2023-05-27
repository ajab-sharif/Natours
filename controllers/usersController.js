const factory = require('./handlerFactory');
const User = require("../models/userModel");
//const catchAysnc = require("../utlis/catchAysnc");
exports.getMe = (req, res, next) => {
    req.params.id = req.user.id;
    next();
}
exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getOne(User);
exports.createUser = factory.createOne(User);
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);
