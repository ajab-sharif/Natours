const express = require('express');

const router = express.Router();
const { aliasTopTours, getAllTours, createTour, getTour, updateTour, deleteTour, getTourStats, getMonthPlan } = require('../controllers/toursController');
const { protect, restrictTo } = require('../controllers/authController');
const reviewRouter = require("./reviewRouter");

router.route('/top-5-cheap').get(aliasTopTours, getAllTours);
router.route('/tour-stats').get(getTourStats);
router.route('/month-plan/:year').get(getMonthPlan);
/*
router
    .route('/:tourId/review')
    .post(
        authController.protect,
        authController.restrictTo('user'),
        reviewController.createReview
    );
*/
router.use('/:tourId/reviews', reviewRouter);

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


module.exports = router;