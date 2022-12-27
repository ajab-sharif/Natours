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
        console.log('DB connection success..');
    })
    .catch(err => console.log(err))

const app = require('./app');

const port = process.env.PORT || 1019;
// eslint-disable-next-line no-console
app.listen(port, () => console.log(`Hi, i'm listing from PORT ${port}..`));
