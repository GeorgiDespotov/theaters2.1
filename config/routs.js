const authController = require('../controllers/authController');
const homeController = require('../controllers/homeController');
const playController = require('../controllers/playController');

module.exports = (app) => {
    app.use('/', homeController);
    app.use('/auth', authController);
    app.use('/play', playController);
}