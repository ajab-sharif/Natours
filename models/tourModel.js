const mongoose = require('mongoose');
const slugify = require('slugify');
//const User = require("./userModel");

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
        required: [true, 'A tour must have a Name'],
        unique: true,
        trim: true,
        maxlength: [40, 'A tour name must have less or equal than 40 characters..'],
        minlength: [10, 'A tour name must have more or equal than 10 characters..'],
        // validate: [validator.isAlpha, 'A tour name must only contain characters... '] // not allow space 
    },
    slug: String,
    duration: {
        type: Number,
        required: [true, "A Tour must have a Duration "]
    },
    difficulty: {
        type: String,
        trim: true,
        required: [true, 'A tour Must have a difficulty'],
        enum: {
            values: ['easy', 'medium', 'difficult'],
            message: 'Difficulty is either: easy, medium or difficult',
        }
    },
    price: {
        type: Number,
        required: [true, 'A Tour Must have a Price']
    },
    summary: {
        type: String,
        trim: true,
        required: [true, 'A Tour must have a summary']
    },
    description: {
        type: String,
        trim: true,
        required: [true, 'A Tour must have a discription']
    },
    imageCover: {
        type: String,
        required: [true, 'A tour must have a cove image']
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
        required: [true, 'A Tour must have a group size']
    },
    ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must be above 5.0'],
        set: val => Math.round(val * 10) / 10 // 4.6666, 46.666 47, 4.7
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
    },
    startLocation: {
        type: {
            type: String,
            default: "Point",
            enum: ['Point']
        },
        coordinates: [Number], // lun , lat
        address: String,
        description: String
    },
    locations: [
        {
            type: {
                type: String,
                default: "Point",
                enum: ['Point']
            },
            coordinates: [Number], // lun , lat
            address: String,
            description: String,
            day: Number
        }
    ],
    guides: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        }
    ]
}, opt);

tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: -1 });
tourSchema.index({ startLocation: '2dsphere' });

tourSchema.virtual('durationWeeks').get(function () {
    return this.duration / 7;
});
// virtual populate
tourSchema.virtual('reviews', {
    ref: 'Review',
    foreignField: "tour",
    localField: '_id'
});

// DOCUMENT MIDDLEWARE: Runs before .save() or .create();
tourSchema.pre('save', function (next) {
    this.slug = slugify(this.name, { lower: true });
    next();
});
/* 
// denormalizer Tour guide data 
tourSchema.pre('save', async function (next) {
    const guidePromises = this.guides.map(async id => await User.findById(id));
    this.guides = await Promise.all(guidePromises);
    next();
});
*/

// Query Middleware
tourSchema.pre(/^find/, function (next) {
    this.find({ secretTour: { $ne: true } });
    this.start = Date.now();
    next();
});
tourSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'guides',
        select: '-__v -passwordChangeAt'
    });
    next();
});
tourSchema.post(/^find/, function (docs, next) {
    // eslint-disable-next-line no-console
    console.log(`Query took time ${Date.now() - this.start} miliseconds..`);
    next();
});

// Aggregation Middleware 

// tourSchema.pre('aggregate', function (next) {
//     this.pipeline().unshift(
//         {
//             $match: {
//                 secretTour: {
//                     $ne: true
//                 }
//             }
//         });
//     next();
// })


const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;
