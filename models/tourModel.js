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
        trim: true
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
    maxGroupSize: {
        type: String,
    },
    ratingsAvarage: {
        type: Number,
        default: 4.5
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    }
});
const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;
