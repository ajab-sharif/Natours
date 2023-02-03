const express = require('express');

const router = express.Router();
const { aliastopTours, getAllTours, createTour, getTour, updateTour, deleteTour, getTourStats, getMonthPlan } = require('../controllers/toursController');

router.route('/top-5-cheap').get(aliastopTours, getAllTours);
router.route('/tour-stats').get(getTourStats);
router.route('/month-plan/:year').get(getMonthPlan);
router
    .route('/')
    .get(getAllTours)
    .post(createTour);
router
    .route('/:id')
    .get(getTour)
    .patch(updateTour)
    .delete(deleteTour);
module.exports = router;