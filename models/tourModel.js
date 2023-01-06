const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
        unique: true,
        trim: true
    },
    duration: {
        type: Number,
        require: [true, "A Tour must have a Duration"]
    },
    difficulty: {
        type: String,
        trim: true,
        require: [true, 'A tour Must have a difficulty']
    },
    price: {
        type: Number,
        require: [true, 'A Tour Must have a Price']
    },
    summary: {
        type: String,
        trim: true,
        require: [true, 'A Tour must have a summary']
    },
    description: {
        type: String,
        trim: true,
        require: [true, 'A Tour must have a discription']
    },
    imageCover: {
        type: String,
        require: [true, 'A tour must have a cove image']
    },
    images: [String],
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    startDates: [String],
    maxGroupSize: {
        type: Number,
        require: [true, 'A Tour must have a group size']
    },
    ratingsAvarage: {
        type: Number,
        default: 4.5
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    priceDiscount: {
        type: Number
    }
});
const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;
