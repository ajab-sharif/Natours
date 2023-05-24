const express = require(`express`);
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require("helmet");
const ExpressMongoSanitize = require("express-mongo-sanitize");
const xssClean = require('xss-clean');
const hpp = require('hpp');
const tourRoute = require('./routes/tourRouter');
const userRoute = require('./routes/userRouter');
const AppError = require('./utlis/appError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

const limiter = rateLimit({
    max: 120,
    windowMs: 60 * 60 * 1000, // 1h
    message: "Too many request from this IP, please try again in an hour!",
});

// Global middelwere 
// set security HTTP headers
app.use(helmet());
//  Limit request from same Api 
app.use('/api', limiter);
// Development Logging 
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));
// for body reading from req.body
app.use(express.json({ limit: '10kb' }));
// Data sanitize against NOSQL injection
app.use(ExpressMongoSanitize());
// data sanitize against XSS 
app.use(xssClean());
// Prevent parameter pollution
app.use(hpp({
    whitelist: [
        'duration',
        'ratingsAverage',
        'ratingsQuantity',
        'maxGroupSize',
        'difficulty',
        'price'
    ]
}));
// Route Munting
app.use('/api/v1/tours', tourRoute);
app.use('/api/v1/users', userRoute);
// unhandle route
app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
// error handling middleware 
app.use(globalErrorHandler);

module.exports = app;