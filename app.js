const express = require(`express`);
const morgan = require('morgan');
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
// unhandle route
app.all('*', (req, res, next) => {
    // res.status(404).json({
    //     status: 'fail',
    //     message: `Can't find ${req.originalUrl} on this server!`
    // });
    // next();
    // create error 
    const err = new Error(`Can't find ${req.originalUrl} on this server!`);
    err.status = 'fail';
    err.statusCode = 404;
    next(err);
});
// error handling middleware 
app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || '500';
    err.status = err.status || 'error';

    res.status(err.statusCode).json({
        status: err.status,
        message: err.message
    });
});
module.exports = app;