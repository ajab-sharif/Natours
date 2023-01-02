const Tour = require('../models/tourModel');

exports.getAllTours = async (req, res) => {
    try {
        const tours = await Tour.find();
        res.status(200).json({
            status: 'success',
            result: tours.length,
            tours
        })
    } catch (err) {
        res.status(400).json({
            status: 'failed',
            message: 'Bad Request'
        });
    }
}

exports.createTour = async (req, res) => {
    try {
        const newTour = await Tour.create(req.body);
        res.status(201).json({
            status: 'success',
            message: 'new Tour Created',
            tour: newTour
        })
    } catch (err) {
        res.status(404).json({
            status: 'failed',
            message: 'Not Found'
        });
    }
};
exports.getTour = async (req, res) => {
    try {
        const tour = await Tour.findById(req.params.id);
        res.status(200).json({
            status: 'success',
            tour
        })
    } catch (err) {
        res.status(404).json({
            status: 'failed',
            message: 'Not Found'
        });
    }
};
exports.updateTour = async (req, res) => {
    try {
        await Tour.findByIdAndUpdate(req.params.id, req.body);
        res.status(200).json({
            status: 'success',
            message: 'Your Tour Updated'
        })
    } catch (err) {
        res.status(404).json({
            status: 'failed',
            message: 'Not Found'
        });
    }
};
exports.deleteTour = async (req, res) => {
    try {
        await Tour.findByIdAndDelete(req.params.id);
        res.status(200).json({
            status: 'success',
            message: 'Your Tour Delated',
            tour: null
        })
    } catch (err) {
        res.status(400).json({
            status: 'failed',
            message: 'Bad Request'
        });
    }
};
