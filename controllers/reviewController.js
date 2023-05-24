const Review = require("../models/reviewModel");
const catchAsync = require("../utlis/catchAysnc");

exports.getAllReviews = catchAsync(async (req, res, next) => {
    const reviews = await Review.find().select('-__v');
    res.status(200).json({
        status: 'success',
        results: reviews.length,
        data: reviews
    });
});
exports.createReview = async (req, res, next) => {
    const newReview = (await Review.create(req.body));

    res.status(201).json({
        status: 'success',
        data: newReview
    });
};