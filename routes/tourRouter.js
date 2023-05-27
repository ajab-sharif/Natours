const express = require('express');

const router = express.Router();
const { aliasTopTours, getAllTours, createTour, getTour, updateTour, deleteTour, getTourStats, getMonthPlan } = require('../controllers/toursController');
const { protect, restrictTo } = require('../controllers/authController');
const reviewRouter = require("./reviewRouter");

router.route('/top-5-cheap').get(aliasTopTours, getAllTours);
router.route('/tour-stats').get(getTourStats);
router.route('/month-plan/:year').get(
    protect,
    restrictTo('admin', 'lead-guide', 'guide'),
    getMonthPlan
);
router.use('/:tourId/reviews', reviewRouter);

router
    .route('/')
    .get(getAllTours)
    .post(protect, restrictTo('admin', 'lead-guide'), createTour);
router
    .route('/:id')
    .get(getTour)
    .patch(protect, restrictTo('admin', 'lead-guide'), updateTour)
    .delete(
        protect,
        restrictTo('admin', 'lead-guide'),
        deleteTour
    );


module.exports = router;