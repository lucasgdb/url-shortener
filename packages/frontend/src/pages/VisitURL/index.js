import React, { useEffect } from 'react';
import { useParams } from 'react-router';
import api from '~/services/api';

export default function VisitURL() {
	const { shortenedURL } = useParams();

	useEffect(() => {
		(async function() {
			const { data } = await api.get(`/url/${shortenedURL}`);

			document.location = data.originalURL;
		})();
	}, []);

	return <></>;
}
