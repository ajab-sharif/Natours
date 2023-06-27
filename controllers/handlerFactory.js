const catchAysnc = require('../utlis/catchAysnc');
const AppError = require('../utlis/appError');
const ApiFeatures = require('../utlis/apiFeatures');

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
exports.createOne = Model => catchAysnc(async (req, res, next) => {
    const doc = await Model.create(req.body);
    res.status(201).json({
        status: 'success',
        data: {
            data: doc
        }
    })
});
exports.getOne = (Model, popOptions) => catchAysnc(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;
    if (!doc) {
        return next(new AppError(`no document found with that ID ${req.params.id}`, 404));
    }
    res.status(200).json({
        status: 'success',
        data: {
            data: doc
        }
    })
});

exports.updateOne = Model => catchAysnc(async (req, res, next) => {

    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    if (!doc) {
        return next(new AppError(`no document found with that ID ${req.params.id}`, 404));
    }
    res.status(200).json({
        status: 'success',
        data: {
            data: doc
        }
    })
});
exports.getAll = Model => catchAysnc(async (req, res, next) => {
    // for find tour reviews only 
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };
    // Execute Query
    const apiFeatures = new ApiFeatures(Model.find(filter), req.query)
        .filter()
        .sort()
        .fieldsLimit()
        .paginate()
    const doc = await apiFeatures.query;
    // Send Response 
    res.status(200).json({
        status: 'success',
        result: doc.length,
        data: {
            data: doc
        }
    })
});