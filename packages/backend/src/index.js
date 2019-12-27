const express = require('express');
const mongoose = require('mongoose');

const app = express();

mongoose.connect('mongodb://localhost/url-shortener', {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

mongoose.connection.once('open', () => console.log('mongodb connected!'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/', (req, res) => res.status(200).json({ status: true }));

app.listen(3001);
