const routes = require('express').Router();
const urlController = require('./controller/url.controller');

// URL
routes.get('/url/:shortenedURL', urlController.getOneURL);
routes.get('/url', urlController.getURLs);
routes.post('/url', urlController.createURL);
routes.delete('/url/:_id', urlController.deleteURL);

module.exports = routes;
