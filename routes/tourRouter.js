const express = require('express');

const router = express.Router();
const { aliastopTours, getAllTours, createTour, getTour, updateTour, deleteTour } = require('../controllers/toursControllers');

router.route('/top-5-cheap').get(aliastopTours, getAllTours);
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