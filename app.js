const express = require(`express`);
const morgan = require('morgan');

const tourRoute = require('./routes/tourRouter');
const userRoute = require('./routes/userRouter');
const AppError = require('./utlis/appError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();
console.log(process.env.NODE_ENV);
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
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
// error handling middleware 
app.use(globalErrorHandler);

module.exports = app;