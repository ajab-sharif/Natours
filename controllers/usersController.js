////////////////////////////// get all Users

const User = require("../models/userModel");
const catchAysnc = require("../utlis/catchAysnc");

///////////////////////////////////////////////
exports.getAllUsers = catchAysnc(async (req, res) => {
    const users = await User.find({});
    res.status(200).json({
        status: 'success',
        result: users.length,
        users
    })
});

////////////////////// get user
////////////////////////////////////////
exports.getUser = (req, res) => {
    res.status(200).json({
        status: 'success',
        data: 'data here'
    })
};
///////////////////////////////// Create User
////////////////////////////////////////////////////////
exports.createUser = (req, res) => {
    res.status(201).json({
        status: 'success',
        message: "your user create success"
    });
};
////////////// update user
/////////////////////////////
exports.updateUser = (req, res) => {
    res.status(200).json({
        status: 'success',
        data: 'update user here ....'
    })
};
////////////// delete tour
/////////////////////////////
exports.deleteUser = (req, res) => {
    res.status(204).json({
        status: 'success',
        data: null
    })
};
