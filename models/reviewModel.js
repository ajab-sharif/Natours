const mongoose = require('mongoose');
// review / rating/ createAt/ ref to tour / ref to user

const reviewSchema = new mongoose.Schema({
    review: {
        type: String,
        trim: true,
        required: [true, 'Review can not be empty!']
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        default: 4.5
    },
    createAt: {
        type: Date,
        default: Date.now()
    },
    tour: {
        type: mongoose.Schema.ObjectId,
        ref: 'Tour',
        required: [true, 'Reviw must belong to a tour'],
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Review must belong to a user'],
    }
},
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;