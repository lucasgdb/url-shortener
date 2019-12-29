import React, { useEffect, useState } from 'react';
import { Client } from 'styletron-engine-atomic';
import { Provider } from 'styletron-react';
import { LightTheme, BaseProvider, DarkTheme } from 'baseui';
// import { FormControl } from 'baseui/form-control';
import { Input } from 'baseui/input';
import { Button } from 'baseui/button';
import {
	Modal,
	ModalHeader,
	ModalBody,
	ModalFooter,
	ModalButton,
	ROLE,
} from 'baseui/modal';
import { StyledLink } from 'baseui/link';
import { Card, StyledBody, StyledAction } from 'baseui/card';
import { Heading, HeadingLevel } from 'baseui/heading';
import { Paragraph3 } from 'baseui/typography';
import Container from '~/components/Container';
import api from '~/services/api';
import validURL from 'valid-url';
import { CopyToClipboard } from 'react-copy-to-clipboard';

const engine = new Client();

export default function Home() {
	const [originalURL, setOriginalURL] = useState('');
	const [isOpen, setIsOpen] = useState(false);
	const [isDarkTheme, setIsDarkTheme] = useState(false);
	const [isShortened, setIsShortened] = useState(false);
	const [serverOriginalURL, setServerOriginalURL] = useState('');
	const [shortenedURL, setShortenedURL] = useState('');
	const [img, setImg] = useState('');

	useEffect(() => {
		document.body.style.background = isDarkTheme ? '#292929' : '#eeeeee';
	}, [isDarkTheme]);

	async function handleSubmit() {
		try {
			if (validURL.isUri(originalURL)) {
				const { data } = await api.post('/url', { originalURL });

				setIsShortened(true);
				setServerOriginalURL(data.data.originalURL);
				setShortenedURL(data.data.shortenedURL);
				setImg(data.QRCode);
				setOriginalURL('');
			} else setIsOpen(true);
		} catch (err) {
			setIsOpen(true);
		}
	}

	return (
		<Provider value={engine}>
			<BaseProvider theme={isDarkTheme ? DarkTheme : LightTheme}>
				<Container>
					<Card>
						<StyledBody>
							<HeadingLevel>
								<Heading styleLevel={4}>URL Shortener</Heading>
							</HeadingLevel>

							<Input
								placeholder="Paste here the URL to be shortened."
								value={originalURL}
								onChange={e =>
									setOriginalURL(e.target.value.trim())
								}
								onKeyUp={e => {
									if (e.which === 13) handleSubmit();
								}}
							/>
						</StyledBody>

						<StyledAction
							style={{
								display: 'flex',
								justifyContent: 'space-between',
							}}
						>
							<Button
								title="Short the pasted URL"
								onClick={handleSubmit}
							>
								Short URL
							</Button>

							<Button
								onClick={() => setIsDarkTheme(!isDarkTheme)}
							>
								Switch Theme
							</Button>
						</StyledAction>
					</Card>

					{isShortened && (
						<Card style={{ overflow: 'hidden' }}>
							<HeadingLevel>
								<Heading styleLevel={4}>Shortened URL</Heading>

								<Paragraph3>
									Long URL:{' '}
									<StyledLink
										href={serverOriginalURL}
										target="_blank"
									>
										{serverOriginalURL}
									</StyledLink>
								</Paragraph3>

								<Paragraph3>
									Shortened URL:{' '}
									<StyledLink
										href={`http://127.0.0.1:3000/${shortenedURL}`}
										target="_blank"
									>
										http://127.0.0.1:3000/{shortenedURL}
									</StyledLink>
								</Paragraph3>
							</HeadingLevel>

							<CopyToClipboard
								text={`http://127.0.0.1:3000/${shortenedURL}`}
							>
								<Button>Copy URL</Button>
							</CopyToClipboard>

							<StyledLink
								style={{ marginLeft: '10px' }}
								href={serverOriginalURL}
								target="_blank"
							>
								Visit URL
							</StyledLink>

							<div
								style={{ margin: '10px 0' }}
								className="divider"
							></div>

							<div
								style={{
									textAlign: 'center',
									marginBottom: '-10px',
								}}
							>
								<img src={img} alt="QRCode" title="QRCode" />
							</div>
						</Card>
					)}
				</Container>
			</BaseProvider>

			<Modal
				unstable_ModalBackdropScroll
				onClose={() => setIsOpen(false)}
				isOpen={isOpen}
				animate
				autoFocus
				role={ROLE.alertdialog}
			>
				<ModalHeader>Error</ModalHeader>

				<ModalBody>
					The URL provived on input is not a valid URL. Please, insert
					a valid URL and try again.
				</ModalBody>

				<ModalFooter>
					<ModalButton onClick={() => setIsOpen(false)}>
						OK
					</ModalButton>
				</ModalFooter>
			</Modal>
		</Provider>
	);
}
