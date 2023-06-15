const express = require(`express`);
const morgan = require('morgan');
const path = require('path');
const rateLimit = require('express-rate-limit');
const helmet = require("helmet");
const ExpressMongoSanitize = require("express-mongo-sanitize");
const xssClean = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const tourRoute = require('./routes/tourRouter');
const userRoute = require('./routes/userRouter');
const reviewRoute = require('./routes/reviewRouter');
const viewRoute = require('./routes/viewRouter');
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
app.set('view engine', 'pug');
// serving static files 
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
// secure Express apps by setting HTTP response headers.
//app.use(helmet());
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ["'self'", 'data:', 'blob:'],

            fontSrc: ["'self'", 'https:', 'data:'],

            scriptSrc: ["'self'", 'unsafe-inline'],

            // eslint-disable-next-line no-dupe-keys
            scriptSrc: ["'self'", 'https://*.cloudflare.com'],

            scriptSrcElem: ["'self'", 'https:', 'https://*.cloudflare.com'],

            styleSrc: ["'self'", 'https:', 'unsafe-inline'],

            connectSrc: ["'self'", 'data', 'https://*.cloudflare.com']
        },
    })
);
//  Limit request from same Api 
app.use('/api', limiter);
// Development Logging 
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));
// for body reading from req.body
app.use(express.json({ limit: '10kb' }));
// cookie parser for reading cookie 
app.use(cookieParser());
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
// test middlewere 
app.use((req, res, next) => {
    //  console.log(req.cookies);
    next();
});
// Route Munting
app.use('/', viewRoute);
app.use('/api/v1/tours', tourRoute);
app.use('/api/v1/users', userRoute);
app.use('/api/v1/reviews', reviewRoute);
// unhandle route
app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
// error handling middleware 
app.use(globalErrorHandler);

module.exports = app;