const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const requireAll = require('require-dir');

const app = express();
const { mongo, port } = require('./config/app.json');
const { host, mongoPort } = mongo;

mongoose.connect(`mongodb://${host}:${mongoPort}/url-shortener`, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

mongoose.connection.once('open', () => {
	requireAll('./models');

	app.use('/api', require('./routes'));

	app.listen(port, () => console.log('node and mongo server started!'));
});
