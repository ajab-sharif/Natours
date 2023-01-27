const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

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
        trim: true,
        maxlength: [40, 'A tour name must have less or equal than 40 characters..'],
        minlength: [10, 'A tour name must have more or equal than 10 characters..'],
        // validate: [validator.isAlpha, 'A tour name must only contain characters... '] // not allow space 
    },
    slug: String,
    duration: {
        type: Number,
        require: [true, "A Tour must have a Duration"]
    },
    difficulty: {
        type: String,
        trim: true,
        require: [true, 'A tour Must have a difficulty'],
        enum: {
            values: ['easy', 'medium', 'difficult'],
            message: 'Difficulty is either: easy, medium or difficult',
        }
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
        default: 4.5,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must be above 5.0']
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    priceDiscount: {
        type: Number,
        validate: {
            validator: function (val) {
                return val < this.price;
            },
            message: ' Discount price ({VALUE}) shold be below regular price'
        }

    },
    secretTour: {
        type: Boolean,
        default: false
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
// Query Middleware
tourSchema.pre(/^find/, function (next) {
    this.find({ secretTour: { $ne: true } });
    this.start = Date.now();
    next();
});
tourSchema.post(/^find/, function (docs, next) {
    // eslint-disable-next-line no-console
    console.log(`Query took time ${Date.now() - this.start} miliseconds..`);
    next();
});
// Aggregation Middleware 
tourSchema.pre('aggregate', function (next) {
    this.pipeline().unshift(
        {
            $match: {
                secretTour: {
                    $ne: true
                }
            }
        });
    // eslint-disable-next-line no-console
    console.log(this.pipeline());
    next();
})


const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;
