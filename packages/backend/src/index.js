const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const requireAll = require('require-dir');

const app = express();
const { mongo, appPort } = require('./config/app.json');
const { username, password, host, mongoPort, database } = mongo;

mongoose.connect(
	`mongodb://${username}:${password}@${host}:${mongoPort}/${database}`,
	{
		useNewUrlParser: true,
		useUnifiedTopology: true,
	}
);

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

mongoose.connection.once('open', () => {
	requireAll('./models');

	app.use('/', require('./routes'));

	app.listen(appPort, () => console.log('node and mongo server started!'));
});
