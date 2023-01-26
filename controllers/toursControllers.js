const Tour = require('../models/tourModel');
const ApiFeatures = require('../utlis/apiFeatures');

exports.aliastopTours = async (req, _, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
    next();
};

exports.getAllTours = async (req, res) => {
    try {
        // Execute Query
        const apiFeatures = new ApiFeatures(Tour.find(), req.query)
            .filter()
            .sort()
            .fieldsLimit()
            .paginate()
        const tours = await apiFeatures.query;
        // Send Response 
        res.status(200).json({
            status: 'success',
            result: tours.length,
            tours
        })
    } catch (err) {
        res.status(400).json({
            status: 'failed',
            message: 'Bad Request!'
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
            message: err
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
        await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
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
exports.getTourStats = async (req, res) => {
    try {
        const stats = await Tour.aggregate([
            {
                $match: {
                    ratingsAverage: {
                        $gte: 4.5
                    }
                }
            },
            {
                $group: {
                    _id: '$difficulty',
                    numTours: { $sum: 1 },
                    avgRating: { $avg: '$ratingsAverage' },
                    avgPrice: { $avg: '$price' },
                    minPrice: { $min: '$price' },
                    maxPrice: { $max: '$price' },
                }
            },

        ]);
        res.status(200).json({
            status: 'success',
            result: stats.length,
            stats
        })
    } catch (err) {
        res.status(400).json({
            status: 'failed',
            message: 'Bad Request'
        });
    }
};
exports.getMonthPlan = async (req, res) => {
    try {
        const year = req.params.year * 1; //2021
        const plan = await Tour.aggregate([
            {
                $unwind: '$startDates',
            },
            {
                $match: {
                    startDates: {
                        $gte: new Date(`${year}-01-01`),
                        $lte: new Date(`${year}-12-31`),
                    }
                }
            },
            {
                $group: {
                    _id: { $month: '$startDates' },
                    numTourStats: { $sum: 1 },
                    name: { $push: '$name' }
                }
            },
            {
                $addFields: { month: '$_id' }
            },
            {
                $sort: { 'numTours': -1 }
            },
            {
                $project: { '_id': 0 }
            },
            {
                $limit: 12
            }
        ]);

        res.status(200).json({
            status: 'success',
            result: plan.length,
            plan
        });
    } catch (err) {
        res.status(400).json({
            status: 'failed',
            message: 'Bad Request'
        });
    }
};