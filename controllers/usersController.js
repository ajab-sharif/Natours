const multer = require('multer');
const factory = require('./handlerFactory');
const User = require("../models/userModel");
const AppError = require('../utlis/appError');
const sharp = require('sharp');

//const catchAysnc = require("../utlis/catchAysnc");
exports.getMe = (req, res, next) => {
    req.params.id = req.user.id;
    next();
}

// const multerStrorage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'public/img/users')
//     },
//     filename: (req, file, cb) => {
//         const ext = file.mimetype.split('/')[1];
//         cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
//     }
// })

const multerStrorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true)
    } else {
        cb(new AppError(`Not an image! Please upload only images.`, 400), false)
    }
}
const upload = multer({
    storage: multerStrorage,
    fileFilter: multerFilter
})

exports.uploadPhoto = upload.single('photo');

exports.resizeUserPhooto = async (req, res, next) => {
    if (!req.file) return next();
    req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;
    await sharp(req.file.buffer)
        .resize(500, 500)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/users/${req.file.filename}`);

    next()
}

exports.createUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not defined! Please use /signup instead'
    });
};

exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getOne(User);
// not use, use update password 
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);
