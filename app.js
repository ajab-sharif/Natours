// module require
const express = require('express');
const fs = require('fs');

// app
const app = express();
// read tours with fs Module
const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`, "utf-8"));
// server start 
const PORT = 3000;
app.listen(PORT, () => console.log(`Hi, i'm listing from PORT ${PORT}..`));
// Route

/////////// get all tours

app.get('/api/v1/tours', (req, res) => {
    res.status(200).json({
        status: "success",
        result: tours.length,
        tours: tours
    });
});

