// module require
const exp = require('constants');
const express = require('express');

// app
const app = express();

// server start 
const PORT = 3000;
app.listen(PORT, () => console.log(`Hi, i'm listing from PORT ${PORT}..`));
// Route
app.get('/', (req, res) => {
    res.status(200).json({
        status: "success",
        message: 'First Code Run...(hello world)..'
    });
});
