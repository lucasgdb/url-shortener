const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

mongoose.connect('mongodb://localhost:27017/url-shortener', {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

app.use(express.json());
app.use(cors());

mongoose.connection.once('open', () => {
	require('./model');

	app.use('/api', require('./routes'));

	app.listen(3001, () => console.log('server initialized!'));

	console.log('database connected!');
});
