///////////// import App 
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const app = require('./app');
const port = process.env.PORT || 1019;
/////////// server start 
/////////////////////////////

app.listen(
    port, () => console.log(`Hi, i'm listing from PORT ${port}..`)
);