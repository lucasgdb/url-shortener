const User = require('mongoose').model('user');
const { validate } = require('email-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { secret } = require('../config/auth.json');

module.exports = {
	async login(req, res) {
		const { userEmail } = req.params;

		try {
			if (validate(userEmail)) {
				const user = await User.findOne({ userEmail }).select(
					'+userPassword'
				);

				if (user) {
					const { userPassword } = req.params;

					if (bcrypt.compareSync(userPassword, user.userPassword)) {
						const token = jwt.sign(
							{ _id: user._id, userEmail: user.userEmail },
							secret
						);

						req._id = user._id;

						return res.status(200).json({
							_id: user._id,
							userEmail: user.userEmail,
							token,
						});
					} else {
						return res
							.status(400)
							.json({ message: 'Invalid password.' });
					}
				} else {
					return res
						.status(400)
						.json({ message: "E-mail doesn't exist." });
				}
			} else {
				return res.status(400).json({ message: 'Invalid e-mail.' });
			}
		} catch (err) {
			return res.status(500).json({ message: 'Server error.' });
		}
	},

	async register(req, res) {
		const { userEmail } = req.body;

		if (validate(userEmail)) {
			const user = await User.findOne({ userEmail });

			if (user) {
				return res
					.status(400)
					.json({ message: 'User already exists.' });
			}

			const { userPassword } = req.body;

			await User.create({
				userEmail,
				userPassword: await bcrypt.hash(userPassword, 10),
			});

			return res.status(201).json({});
		} else {
			return res.status(400).json({ message: 'Invalid e-mail.' });
		}
	},

	async authenticate(req, res) {
		const { token } = req.params;

		jwt.verify(token, secret, (err, decoded) => {
			if (err) {
				return res.status(401).json({ message: 'Invalid token' });
			}

			return res
				.status(200)
				.json({ _id: decoded._id, userEmail: decoded.userEmail });
		});
	},
};
