const routes = require('express').Router();
const userMiddleware = require('./middlewares/user.middleware');
const urlController = require('./controllers/url.controller');
const userController = require('./controllers/user.controller');

// URL
routes.get('/url/:shortenedURL', urlController.getOneURL);
routes.get('/url', userMiddleware, urlController.getURLs);
routes.post('/url', urlController.createURL);
routes.delete('/url/:_id', userMiddleware, urlController.deleteURL);

// User
routes.post('/user', userController.register);
routes.get('/user/:userEmail/:userPassword', userController.login);
routes.get('/user/:token', userController.authenticate);

module.exports = routes;
