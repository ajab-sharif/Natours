// This File Just For Added Dev Data in Our DATEBASE th9is file not connected or link in our project
/////////////////////////////////////////////
///npm command
///import data
//- node import-dev-data.js --import
/// delete data
//- node import-dev-data.js --delete

const fs = require('fs');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Tour = require('./models/tourModel');
const User = require('./models/userModel');
const Review = require('./models/reviewModel');


dotenv.config({ path: 'config.env' });

const DB = process.env.DATABASE_URL.replace(/<PASSWORD>/g, process.env.DATABASE_PASSWORD);

/// read file 
const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/dev-data/data/tours.json`, 'utf-8')
);
const users = JSON.parse(
    fs.readFileSync(`${__dirname}/dev-data/data/users.json`, 'utf-8')
);
const reviews = JSON.parse(
    fs.readFileSync(`${__dirname}/dev-data/data/reviews.json`, 'utf-8')
);
const dataDelete = async function () {
    try {
        await Tour.deleteMany({});
        await User.deleteMany({});
        await Review.deleteMany({});

        console.log('all data delated !!');
    } catch (err) {
        console.log('something went wrong D')
    }
    process.exit()
}
const dataImports = async function () {
    try {
        await Tour.create(tours);
        await User.create(users, { validateBeforeSave: false });
        await Review.create(reviews);
        console.log('all data added !!');
    } catch (err) {
        console.log('something went wrong')
    }
    process.exit()
}
if (process.argv[2] === '--import') {
    dataImports();
} else if (process.argv[2] === '--delete') {
    dataDelete()
}
mongoose.connect(DB, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('DB connection success..');
})
    .catch(err => console.log(err))