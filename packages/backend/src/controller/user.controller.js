const user = require('mongoose').model('user');
const { validate } = require('email-validator');
const bcrypt = require('bcryptjs');

module.exports = {
	async register(req, res) {
		const { userEmail } = req.body;

		if (validate(userEmail)) {
			const exists = await user.findOne({ userEmail });

			if (exists) {
				return res
					.status(200)
					.json({ status: false, message: 'User already exists.' });
			}

			const { userPassword } = req.body;

			await user.create({
				userEmail,
				userPassword: await bcrypt.hash(userPassword, 10),
			});

			return res.status(201).json({ status: true });
		} else {
			return res
				.status(200)
				.json({ status: false, message: 'Invalid e-mail.' });
		}
	},

	async login(req, res) {
		const { userEmail } = req.params;

		if (validate(userEmail)) {
			const exists = await user
				.findOne({ userEmail })
				.select('+ userPassword');

			if (exists) {
				const { userPassword } = req.params;

				if (bcrypt.compareSync(userPassword, exists.userPassword)) {
					return res.status(200).json({ status: true });
				} else {
					return res
						.status(200)
						.json({ status: false, message: 'Invalid password.' });
				}
			} else {
				return res
					.status(200)
					.json({ status: false, message: "E-mail doesn't exist." });
			}
		} else {
			return res
				.status(200)
				.json({ status: false, message: 'Invalid e-mail.' });
		}
	},
};
