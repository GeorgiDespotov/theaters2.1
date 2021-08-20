const express = require('express');

const { PORT } = require('./config');
const databaseConfig = require('./config/database');
const expressConfig = require('./config/express');
const routsConfig = require('./config/routs');


start();

async function start() {
    const app = express();
    
    await databaseConfig(app);
    expressConfig(app);
    routsConfig(app);
    
    app.get('/', (req, res) => res.send('It works!'));
    
    app.listen(PORT, () => { console.log(`Application started at http://localhost:${PORT}`)});
}




