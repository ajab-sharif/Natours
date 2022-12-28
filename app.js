const express = require(`express`);
const morgan = require('morgan');
const mongoose = require('mongoose')
const tourRoute = require('./routes/tourRouter');
const userRoute = require('./routes/userRouter');

const app = express();
////////////////////////////////////// midlewere
//// logger
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));
// for body reading
app.use(express.json());
// Route Munting
app.use('/api/v1/tours', tourRoute);
app.use('/api/v1/users', userRoute);
// tour schema
///////////////////////// 
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
});

// eslint-disable-next-line new-cap
const Tour = new mongoose.model('Tour', tourSchema);
const testTour = new Tour({
    name: 'this  just for test 2',
    duration: 32,
    price: 232
});
testTour.save()
    .then(doc => console.log(doc))
    .catch(err => console.log(err))
module.exports = app;