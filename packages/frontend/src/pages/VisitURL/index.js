import React, { useEffect } from 'react';
import api from '~/services/api';

import { useParams } from 'react-router';

export default function VisitURL() {
	const { shortenedURL } = useParams();

	useEffect(() => {
		(async function() {
			const { data } = await api.get(`/url/${shortenedURL}`);

			if (!data.error) document.location = data.originalURL;
			else document.location = '/';
		})();
	}, [shortenedURL]);

	return <></>;
}
