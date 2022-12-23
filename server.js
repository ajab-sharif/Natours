///////////// import App 

const app = require('./app');
const PORT = 3000;
/////////// server start 
/////////////////////////////
app.listen(
    PORT, () => console.log(`Hi, i'm listing from PORT ${PORT}..`)
);