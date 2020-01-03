const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const appConfig = require('./config/app.json');

mongoose.connect(`mongodb://${appConfig.mongo.host}:${appConfig.mongo.port}/url-shortener`, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

mongoose.connection.once('open', () => {
	require('./models');

	app.use('/api', require('./routes'));

	app.listen(3001, () => console.log('server initialized!'));

	console.log('database connected!');
});
