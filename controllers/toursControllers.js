///// const express = require(express);
const fs = require('fs');
// read tours with fs Module
const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`, "utf-8"));
///////////////////////// get all tours
///////////////////////////////////////////
exports.getAllTours = (req, res) => {
    res.status(200).json({
        status: "success",
        result: tours.length,
        tours: tours
    });
}

//////////// creat Tour 
////////////////////////////////////
exports.createTour = (req, res) => {
    const newId = tours[tours.length - 1].id + 1;
    const newTour = Object.assign({ id: newId }, req.body);
    tours.push(newTour)
    fs.writeFile(
        `${__dirname}/../dev-data/data/tours-simple.json`,
        JSON.stringify(tours),
        (err) => {
            res.status(201).json({
                status: 'success',
                data: newTour
            })
        })
};
////////////////////// get tour
////////////////////////////////////////
exports.getTour = (req, res) => {
    const id = req.params.id * 1;
    const tour = tours.find(el => el.id === id);
    // if (!tour) {
    if (req.params.id * 1 > tours.length) {
        return res.status(404).json({
            status: 'invalid id',
            data: null,
        });
    }
    res.status(200).json({
        status: 'success',
        data: tour
    })
};
////////////// update tour
/////////////////////////////
exports.updateTour = (req, res) => {
    const id = req.params.id * 1;
    // let tour = tours.find(el => el.id === id);
    // if (!tour) {
    if (req.params.id * 1 > tours.length) {
        return res.status(404).json({
            status: 'invalid id',
            data: null,
        });

    }
    res.status(200).json({
        status: 'success',
        data: 'update tour here ....'
    })
};

////////////// delete tour
/////////////////////////////
exports.deleteTour = (req, res) => {
    const id = req.params.id * 1;
    // if (!tour) {
    if (req.params.id * 1 > tours.length) {
        return res.status(404).json({
            status: 'invalid id',
            data: null,
        });

    }
    delete tours[id];
    res.status(204).json({
        status: 'success',
        data: null
    })
};