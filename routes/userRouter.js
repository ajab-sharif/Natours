const express = require('express');
const { getAllUsers, getUser, createUser, updateUser, deleteUser, getMe } = require('../controllers/usersController');
const authController = require('../controllers/authController');

const router = express.Router();

router.get('/me', authController.protect, getMe, getUser);
router.post('/singup', authController.singup);
router.post('/login', authController.login);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);
router.patch('/updateMyPassword', authController.protect, authController.updateMyPassword);
router.patch('/updateMe', authController.protect, authController.updateMe);
router.delete('/deleteMe', authController.protect, authController.deleteMe);

// route without ID
router
    .route('/')
    .get(getAllUsers)
    .post(createUser);
/////// route with ID
router
    .route('/:id')
    .get(getUser)
    .patch(updateUser)
    .delete(deleteUser);

module.exports = router;