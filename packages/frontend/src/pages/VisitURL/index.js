import React, { useEffect } from 'react';
import api from '~/services/api';

import { useParams } from 'react-router';

export default function VisitURL() {
	const { shortenedURL } = useParams();

	useEffect(() => {
		(async function() {
			const { data } = await api.get(`/url/${shortenedURL}`);

			document.location = data.originalURL;
		})();
	}, [shortenedURL]);

	return <></>;
}
