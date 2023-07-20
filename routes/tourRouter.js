const express = require('express');

const router = express.Router();
const {
    getDistances, getToursWithin,
    aliasTopTours, getAllTours, createTour,
    getTour, updateTour, deleteTour, getTourStats,
    getMonthPlan, uploadTourImages, resizeTourImages } = require('../controllers/toursController');

const { protect, restrictTo } = require('../controllers/authController');
const reviewRouter = require("./reviewRouter");

router.use('/:tourId/reviews', reviewRouter);

router.route('/top-5-cheap').get(aliasTopTours, getAllTours);
router.route('/tour-stats').get(getTourStats);
router.route('/month-plan/:year').get(
    protect,
    restrictTo('admin', 'lead-guide', 'guide'),
    getMonthPlan
);
router
    .route('/distances/:latlng/unit/:unit')
    .get(getDistances)
router
    .route('/tours-within/:distance/center/:latlng/unit/:unit')
    .get(getToursWithin);

router
    .route('/')
    .get(getAllTours)
    .post(protect, restrictTo('admin', 'lead-guide'), createTour);


router
    .route('/:id')
    .get(getTour)
    .patch(
        protect,
        restrictTo('admin', 'lead-guide'),
        uploadTourImages,
        resizeTourImages,
        updateTour
    )
    .delete(
        protect,
        restrictTo('admin', 'lead-guide'),
        deleteTour
    );


module.exports = router;