// module require
const express = require('express');
const fs = require('fs');
const morgan = require('morgan');

// app
const app = express();
////////////////////////////////////// midlewere
/////////////////////////////////////////////////
// for body reading
app.use(express.json());
//// logger
app.use(morgan('dev'));
// read tours with fs Module
const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`, "utf-8"));
/////////////////////// server start 
/////////////////////////////
const PORT = 3000;
app.listen(PORT, () => console.log(`Hi, i'm listing from PORT ${PORT}..`));

///*
///////////////////////////////// Tour Route


// Route
/////////// get all tours
//////////////////////////////////
const getAllTours = (req, res) => {
    res.status(200).json({
        status: "success",
        result: tours.length,
        tours: tours
    });
}

//////////// creat Tour 
////////////////////////////////////
const createTour = (req, res) => {
    const newId = tours[tours.length - 1].id + 1;
    const newTour = Object.assign({ id: newId }, req.body);
    tours.push(newTour)
    fs.writeFile(
        `${__dirname}/dev-data/data/tours-simple.json`,
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
const getTour = (req, res) => {
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
const updateTour = (req, res) => {
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
const deleteTour = (req, res) => {
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
}
//  * /
// /*
////////////////////////////// get all Users
///////////////////////////////////////////////

const getAllUsers = (req, res) => {
    res.status(200).json({
        status: 'success',
        result: 'users length here...',
        users: "[all users]"
    })
}

////////////////////// get user
////////////////////////////////////////
const getUser = (req, res) => {
    res.status(200).json({
        status: 'success',
        data: 'data here'
    })
};
///////////////////////////////// Create User
////////////////////////////////////////////////////////
const createUser = (req, res) => {
    res.status(201).json({
        status: 'success',
        message: "your user create success"
    });
};
////////////// update user
/////////////////////////////
const updateUser = (req, res) => {
    res.status(200).json({
        status: 'success',
        data: 'update user here ....'
    })
};



////////////// delete tour
/////////////////////////////
const deleteUser = (req, res) => {
    res.status(204).json({
        status: 'success',
        data: null
    })
};
//  */ 

////////////////////////////////////-------Route (Tour Route)
/////////////////////////////////////////////////////////
/*
////////// route without ID
app.get('/api/v1/tours', getAllTours);
app.post('/api/v1/tours', createTour);
////////// route with ID
app.get('/api/v1/tours/:id', getTour);
app.patch('/api/v1/tours/:id', updateTour)
app.delete('/api/v1/tours/:id', deleteTour);
 
*/
///////////----------Better Way
//////////////////

// route without ID
app.route('/api/v1/tours')
    .get(getAllTours)
    .post(createTour);
/////// route with ID
app.route('/api/v1/tours/:id')
    .get(getTour)
    .patch(updateTour)
    .delete(deleteTour);


////////////////////////////////////-------Route (User Route)
/////////////////////////////////////////////////////////
/*
////////// route without ID
app.get('/api/v1/users', getAllUsers);
app.post('/api/v1/users', createUser);
////////// route with ID
app.get('/api/v1/users/:id', getUser);
app.patch('/api/v1/users/:id', updateUser)
app.delete('/api/v1/users/:id', deleteUser);
 
*/
///////////----------Better Way
//////////////////

// route without ID
app.route('/api/v1/users')
    .get(getAllUsers)
    .post(createUser);
/////// route with ID
app.route('/api/v1/users/:id')
    .get(getUser)
    .patch(updateUser)
    .delete(deleteUser);


