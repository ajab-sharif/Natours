
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

const sendErrDev = (err, req, res) => {
    // Check if the request was made to the `/api` endpoint.
    if (req.originalUrl.startsWith('/api')) {
        // Send back a JSON response with detailed information about the error.
        res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack
        });
    }
    console.log(err, '❌');
    // Send back a HTML error page with a simple message.
    return res.status(err.statusCode).render('error', {
        title: 'Something went wrong',
        msg: err.message
    });
};

const sendErrProd = (err, req, res) => {
    // A ) If the error is operational, return a JSON response with detailed information about the error.
    if (req.originalUrl.startsWith('/api')) {
        if (err.isOperational) {
            return res.status(err.statusCode).json({
                status: err.status,
                message: err.message
            })
        }
        // B ) Otherwise, return a JSON response with a generic error message.
        return res.status(500).json({
            status: 'error',
            message: 'Something went very Wrong!'
        })
    }
    // Rendering website Error 
    // A ) if the error operational, render error wtih detailed information
    if (err.isOperational) {
        return res.status(err.statusCode).render('error', {
            title: 'Something went wrong!',
            msg: err.message
        })
    }
    // B ) Otherwise, render website eorror with a generic error message
    return res.status(err.statusCode).render('error', {
        title: 'Something went very Wrong!',
        msg: 'Please try again latter'
    })
};
module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    if (process.env.NODE_ENV === 'development') {
        sendErrDev(err, req, res);
    } else if (process.env.NODE_ENV === 'production') {
        let error = { ...err };
        error.message = err.message;
        if (err.name === 'CastError') error = handleCastErrorDB(error);
        if (err.code === 11000) error = handleDuplicateErrorDB(error);
        //console.log(Object.values(error.errors), 'OK');
        if (err.name === 'ValidationError') error = handleValidationErrorDB(err);
        if (err.name === 'JsonWebTokenError') error = handleJsonWebTokenError(err);
        if (err.name === 'TokenExpiredError') error = handleTokenExpiredError(err);

        sendErrProd(error, req, res);
    }
};  