const catchAysnc = require('../utlis/catchAysnc');
const AppError = require('../utlis/appError');

exports.deleteOne = Model => catchAysnc(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
        return next(new AppError(`no document found with that ID ${req.params.id}`, 404));
    }
    res.status(204).json({
        status: 'success',
        tour: null
    })
});
