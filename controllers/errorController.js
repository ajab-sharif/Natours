
const AppError = require("../utlis/appError");

const handleCastErrorDB = err => {
    const message = `invlid ${err.path} : ${err.value}`;
    return new AppError(message, 400);
}
const handleDuplicateErrorDB = err => {
    const value = err.keyValue.name;
    const message = `Duplicate field value : "${value}" please use another value!`;
    return new AppError(message, 400);
}
const handleValidationErrorDB = err => {
    const msg = err.message;
    return new AppError(msg, 400);

}
const handleJsonWebTokenError = function () {
    return new AppError('Your token invalid , please login again!', 401);
};

const handleTokenExpiredError = function () {
    return new AppError('Your has been expired , please login again!', 401);
}

const sendErrDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    });
};
const sendErrProd = (err, res) => {
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        })
    } else {
        res.status(500).json({
            status: 'error',
            message: 'Something went very Wrong!'
        })
    }
};
module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    if (process.env.NODE_ENV === 'development') {
        sendErrDev(err, res)
    } else if (process.env.NODE_ENV === 'production') {
        let error = { ...err };

        if (err.name === 'CastError') error = handleCastErrorDB(error);
        if (err.code === 11000) error = handleDuplicateErrorDB(error);
        //console.log(Object.values(error.errors), 'OK');
        if (err.name === 'ValidationError') error = handleValidationErrorDB(err);
        if (err.name === 'JsonWebTokenError') error = handleJsonWebTokenError(err);
        if (err.name === 'TokenExpiredError') error = handleTokenExpiredError(err);

        sendErrProd(error, res);
    }
};  