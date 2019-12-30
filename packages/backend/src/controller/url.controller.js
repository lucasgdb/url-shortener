const url = require('mongoose').model('url');
const qrcode = require('qrcode');
const { isUri } = require('valid-url');

module.exports = {
	async getURLs(req, res) {
		const URLs = await url.find();

		return res.status(200).json(URLs);
	},

	async getOneURL(req, res) {
		const { shortenedURL } = req.params;

		const URL = await url.findOne({ shortenedURL });

		if (URL) return res.status(200).json(URL);
		else return res.status(400).json({});
	},

	async createURL(req, res) {
		const { originalURL } = req.body;

		if (isUri(originalURL)) {
			const exist = await url.findOne({ originalURL });

			if (exist) {
				const QRCode = await qrcode.toDataURL(exist.originalURL);

				return res.status(201).json({ data: exist, QRCode });
			}

			const URL = await url.create({
				originalURL,
				shortenedURL: (
					Date.now().toString(36) + Math.random().toString(36)
				).substr(3, 5),
			});

			const QRCode = await qrcode.toDataURL(originalURL);

			return res.status(201).json({ data: URL, QRCode });
		} else return res.status(400).json({ status: 'Invalid URL' });
	},

	async deleteURL(req, res) {
		const { _id } = req.params;

		const result = await url.findByIdAndRemove(_id);

		return res.status(200).json({ status: result ? true : false });
	},
};
