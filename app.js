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
    res.status(404).json({
        status: 'fail',
        message: `Can't find ${req.originalUrl} on this server!`
    });
    next();
});

module.exports = app;