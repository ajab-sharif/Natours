const Tour = require('../models/tourModel');
const catchAysnc = require('../utlis/catchAysnc');
const factory = require('./handlerFactory');
//const AppError = require('../utlis/appError');
//const ApiFeatures = require('../utlis/apiFeatures');

exports.aliasTopTours = async (req, _, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
    next();
};

exports.getAllTours = factory.getAll(Tour);
exports.createTour = factory.createOne(Tour);
exports.getTour = factory.getOne(Tour, { path: 'reviews' });
exports.updateTour = factory.updateOne(Tour);
exports.deleteTour = factory.deleteOne(Tour);

exports.getTourStats = catchAysnc(async (req, res, next) => {
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
});
exports.getMonthPlan = catchAysnc(async (req, res) => {
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
});