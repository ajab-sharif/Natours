const mongoose = require('mongoose');
const slugify = require('slugify');

const opt = {
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals: true
    }
}
const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
        unique: true,
        trim: true
    },
    slug: String,
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
        select: false
    },
    startDates: [Date],
    maxGroupSize: {
        type: Number,
        require: [true, 'A Tour must have a group size']
    },
    ratingsAverage: {
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
}, opt);

tourSchema.virtual('dorationWeeks').get(function () {
    return this.duration / 7;
});
// DOCUMENT MIDDLEWARE: Runs before .save() or .create();

tourSchema.pre('save', function (next) {
    this.slug = slugify(this.name, { lower: true });
    next();
});
tourSchema.pre('save', (next) => {
    // console.log('will save document...');
    next();
});
tourSchema.post('save', (docs, next) => {
    // console.log(docs);
    next();
});

const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;
