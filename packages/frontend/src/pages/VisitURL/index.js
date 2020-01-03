import React, { useEffect } from 'react';
import api from '~/services/api';

import { Spinner } from 'baseui/spinner';
import { Client } from 'styletron-engine-atomic';
import { Provider } from 'styletron-react';
import { LightTheme, BaseProvider, DarkTheme } from 'baseui';

import { useParams } from 'react-router';

const engine = new Client();

export default function VisitURL({ isDarkTheme }) {
	const { shortenedURL } = useParams();

	useEffect(() => {
		(async () => {
			try {
				const { data } = await api.get(`/url/${shortenedURL}`);

				document.location = data.originalURL;
				return;
			} catch (err) {
				document.location = '/';
				return;
			}
		})();
	}, [shortenedURL]);

	return (
		<Provider value={engine}>
			<BaseProvider theme={isDarkTheme ? DarkTheme : LightTheme}>
				<Spinner
					style={{
						top: '50%',
						left: '50%',
						transform: 'translate(-50%, -50%)',
						position: 'absolute',
						width: '50px',
						height: '50px',
					}}
				/>
			</BaseProvider>
		</Provider>
	);
}
