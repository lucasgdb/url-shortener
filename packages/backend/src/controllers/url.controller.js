const URL = require('mongoose').model('url');
const qrcode = require('qrcode');
const { isUri } = require('valid-url');

module.exports = {
	async getURLs(req, res) {
		const url = await URL.find({ userID: req._id });

		return res.status(200).json(url);
	},

	async getOneURL(req, res) {
		const { shortenedURL } = req.params;

		const url = await URL.findOne({ shortenedURL });

		if (url) return res.status(200).json(url);
		else return res.status(400).json({});
	},

	async createURL(req, res) {
		const { originalURL } = req.body;

		if (isUri(originalURL)) {
			const { userID } = req.body;

			if (userID === undefined) {
				const exist = await URL.findOne({ originalURL, userID: null });

				if (exist) {
					const QRCode = await qrcode.toDataURL(exist.originalURL);

					return res.status(201).json({ data: exist, QRCode });
				}
			}

			const url = await URL.create({
				originalURL,
				shortenedURL: (
					Date.now().toString(36) + Math.random().toString(36)
				).substr(3, 5),
				userID: userID ? userID : undefined,
			});

			url.userID = undefined;

			const QRCode = await qrcode.toDataURL(originalURL);

			return res.status(201).json({ data: url, QRCode });
		} else return res.status(400).json({ message: 'Invalid URL' });
	},

	async deleteURL(req, res) {
		const { _id } = req.params;

		await URL.findByIdAndRemove(_id);

		return res.status(200).json({});
	},
};
