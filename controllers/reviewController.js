const Review = require("../models/reviewModel");
const catchAsync = require("../utlis/catchAysnc");

exports.getAllReviews = catchAsync(async (req, res, next) => {
    let filter = {};
    if (req.body.tour) filter = { tour: req.params.tourId };
    console.log(filter);
    const reviews = await Review.find(filter).select('-__v');
    res.status(200).json({
        status: 'success',
        results: reviews.length,
        data: reviews
    });
});
exports.createReview = async (req, res, next) => {
    if (!req.body.tour) req.body.tour = req.params.tourId;
    if (!req.body.user) req.body.user = req.user.id;

    const newReview = await Review.create(req.body);

    res.status(201).json({
        status: 'success',
        data: newReview
    });
};