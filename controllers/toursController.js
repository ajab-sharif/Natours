const Tour = require('../models/tourModel');
const AppError = require('../utlis/appError');
const catchAysnc = require('../utlis/catchAysnc');
const factory = require('./handlerFactory');
const multer = require('multer');
const sharp = require('sharp');

//const ApiFeatures = require('../utlis/apiFeatures');

const multerStrorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true)
    } else {
        cb(new AppError(`Not an image! Please upload only images.`, 400), false)
    }
}
const upload = multer({
    storage: multerStrorage,
    fileFilter: multerFilter
})
// upload multiple images for multiple fields
exports.uploadTourImages = upload.fields([
    { name: 'imageCover', maxCount: 1 },
    { name: 'images', maxCount: 3 }
]);

// upload one image for one fields
//upload.single('image'); req.file
// upload multiple images for one field
//upload.array('images');req.files

exports.resizeTourImages = catchAysnc(async (req, res, next) => {
    /*
        if (req.files.imageCover) {
            // 1 Cover Image
            req.body.imageCover = `tour-${req.params.id}-${Date.now()}-cover.jpeg`;
            await sharp(req.files.imageCover[0].buffer)
                .resize(2000, 1333)
                .toFormat('jpeg')
                .jpeg({ quality: 90 })
                .toFile(`public/img/tours/${req.body.imageCover}`);
        }
        if (req.files.images) {
            // 2) images
            req.body.images = [];
            console.log(req.files.images);
            await Promise.all(
                req.files.images.map(async (file, i) => {
                    const filename = `tour-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;
                    console.log(file);
                    await sharp(file.buffer)
                        .resize(2000, 1333)
                        .toFormat('jpeg')
                        .jpeg({ quality: 90 })
                        .toFile(`public/img/tours/${filename}`);
    
                    req.body.images.push(filename);
                })
            )
        }
        next()
    */
    if (!req.files.imageCover || !req.files.images) return next();
    // 1 Cover Image
    req.body.imageCover = `tour-${req.params.id}-${Date.now()}-cover.jpeg`;

    await sharp(req.files.imageCover[0].buffer)
        .resize(2000, 1333)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/tours/${req.body.imageCover}`

        );
    // 2) images
    req.body.images = [];

    await Promise.all(
        req.files.images.map(async (file, i) => {
            const filename = `tour-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;
            console.log(file);
            await sharp(file.buffer)
                .resize(2000, 1333)
                .toFormat('jpeg')
                .jpeg({ quality: 90 })
                .toFile(`public/img/tours/${filename}`);

            req.body.images.push(filename);
        })
    )
    next()
})

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
        results: stats.length,
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

// route('/tours-within/:distance/center/:latlng/unit/:unit', getToursWithin);

exports.getToursWithin = catchAysnc(async (req, res, next) => {
    const { distance, latlng, unit } = req.params;
    const [lat, lng] = latlng.split(',');

    const radius = unit === 'mi' ? distance / 3963.2 : distance / 6388.1;

    if (!lat || !lng) {
        return next(
            new AppError("Please provide laitutr and laongitude in the format lat,lng", 400)

        )
    }

    const tours = await Tour.find({
        startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }

    });
    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
            data: tours
        }
    });
});
exports.getDistances = catchAysnc(async (req, res, next) => {
    const { latlng, unit } = req.params;

    const [lat, lng] = latlng.split(',');

    const multiplier = unit === 'mi' ? 0.00062137119 : 0.001;

    if (!lat || !lng) {
        return next(
            new AppError("Please provide laitutr and laongitude in the format lat,lng", 400)

        )
    }
    const distances = await Tour.aggregate([
        {
            $geoNear: {
                near: {
                    type: 'Point',
                    coordinates: [lng * 1, lat * 1]
                },
                distanceField: 'distance',
                distanceMultiplier: multiplier
            },
        },
        {
            $project: {
                distance: 1,
                name: 1

            }
        }
    ])

    res.status(200).json({
        status: 'success',
        data: {
            data: distances
        }
    });
});