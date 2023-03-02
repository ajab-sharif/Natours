const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({ path: './config.env' });
const DB = process.env.DATABASE_URL.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose.connect(DB, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        // eslint-disable-next-line no-console
        console.log('DB connection success..');
    })
// uncaughtException
process.on('uncaughtException', (err) => {
    // eslint-disable-next-line no-console
    console.log(err.name, err.message);
    process.exit(1);
});
const app = require('./app');

const port = process.env.PORT || 1019;
// eslint-disable-next-line no-console

// eslint-disable-next-line no-console
const server = app.listen(port, () => console.log(`Hi, i'm listing from PORT ${port}..`));
// unhandleRejection
process.on('unhandledRejection', (err) => {
    // eslint-disable-next-line no-console
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    })
});
