const express = require('express');
const { getAllUsers, getUser, createUser, updateUser, deleteUser, getMe } = require('../controllers/usersController');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/singup', authController.singup);
router.post('/login', authController.login);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);
// Protect all routes after this middlewere 
router.use(authController.protect);

router.get('/me', getMe, getUser);
router.patch('/updateMyPassword', authController.updateMyPassword);
router.patch('/updateMe', authController.updateMe);
router.delete('/deleteMe', authController.deleteMe);

//  
router.use(authController.restrictTo('admin'));
router
    .route('/')
    .get(getAllUsers)
    .post(createUser);
router
    .route('/:id')
    .get(getUser)
    .patch(updateUser)
    .delete(deleteUser);
module.exports = router;