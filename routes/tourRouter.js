const express = require('express');

const router = express.Router();
const { aliasTopTours, getAllTours, createTour, getTour, updateTour, deleteTour, getTourStats, getMonthPlan } = require('../controllers/toursController');
const { protect } = require('../controllers/authController');

router.route('/top-5-cheap').get(aliasTopTours, getAllTours);
router.route('/tour-stats').get(getTourStats);
router.route('/month-plan/:year').get(getMonthPlan);
router
    .route('/')
    .get(protect,getAllTours)
    .post(createTour);
router
    .route('/:id')
    .get(getTour)
    .patch(updateTour)
    .delete(deleteTour);
module.exports = router;