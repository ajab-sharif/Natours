const express = require('express');

const router = express.Router();
const { aliasTopTours, getAllTours, createTour, getTour, updateTour, deleteTour, getTourStats, getMonthPlan } = require('../controllers/toursController');
const { protect, restrictTo } = require('../controllers/authController');
const authController = require('../controllers/authController');
const reviewController = require('../controllers/reviewController');

router.route('/top-5-cheap').get(aliasTopTours, getAllTours);
router.route('/tour-stats').get(getTourStats);
router.route('/month-plan/:year').get(getMonthPlan);
router
    .route('/')
    .get(protect, getAllTours)
    .post(createTour);
router
    .route('/:id')
    .get(getTour)
    .patch(updateTour)
    .delete(
        protect,
        restrictTo('admin', 'lead-guied'),
        deleteTour
    );

router
    .route('/:tourId/review')
    .post(
        authController.protect,
        authController.restrictTo('user'),
        reviewController.createReview
    );

module.exports = router;