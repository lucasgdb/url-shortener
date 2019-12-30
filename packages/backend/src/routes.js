const routes = require('express').Router();
const urlController = require('./controller/url.controller');
const userController = require('./controller/user.controller');

// URL
routes.get('/url/:shortenedURL', urlController.getOneURL);
routes.get('/url', urlController.getURLs);
routes.post('/url', urlController.createURL);
routes.delete('/url/:_id', urlController.deleteURL);

// User
routes.post('/user', userController.register);
routes.get('/user/:userEmail/:userPassword', userController.login);

module.exports = routes;
