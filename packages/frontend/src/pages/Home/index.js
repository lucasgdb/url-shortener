import React, { useEffect, useState } from 'react';
import { isUri } from 'valid-url';
import { validate } from 'email-validator';
import API from '~/services/api';
import Container from '~/components/Container';

import { Client } from 'styletron-engine-atomic';
import { Provider } from 'styletron-react';
import { LightTheme, BaseProvider, DarkTheme } from 'baseui';
import { Input } from 'baseui/input';
import { Button, KIND } from 'baseui/button';
import { StyledLink } from 'baseui/link';
import { Card, StyledBody, StyledAction } from 'baseui/card';
import { Heading, HeadingLevel } from 'baseui/heading';
import { Paragraph3 } from 'baseui/typography';
import { FormControl } from 'baseui/form-control';
import { Alert } from 'baseui/icon';
import { useStyletron } from 'baseui';
import { StatefulPopover, PLACEMENT } from 'baseui/popover';
import { StatefulTooltip } from 'baseui/tooltip';
import {
	Modal,
	ModalHeader,
	ModalBody,
	ModalFooter,
	ModalButton,
	ROLE,
} from 'baseui/modal';
import {
	HeaderNavigation,
	ALIGN,
	StyledNavigationList,
	StyledNavigationItem,
} from 'baseui/header-navigation';

import { CopyToClipboard } from 'react-copy-to-clipboard';

const engine = new Client();

export default function Home({ darkTheme }) {
	const [originalURL, setOriginalURL] = useState('');
	const [isOpen, setIsOpen] = useState(false);
	const [loginModalIsOpen, setLoginModalIsOpen] = useState(false);
	const [registerModalIsOpen, setRegisterModalIsOpen] = useState(false);
	const [isDarkTheme, setIsDarkTheme] = useState(darkTheme ? true : false);
	const [isShortened, setIsShortened] = useState(false);
	const [serverOriginalURL, setServerOriginalURL] = useState('');
	const [shortenedURL, setShortenedURL] = useState('');
	const [img, setImg] = useState('');
	const [fetching, setFetching] = useState(false);
	const [loginFetching, setLoginFetching] = useState(false);
	const [registerFetching, setRegisterFetching] = useState(false);
	const [userLoginEmail, setUserLoginEmail] = useState('');
	const [userLoginPassword, setUserLoginPassword] = useState('');
	const [userRegisterEmail, setUserRegisterEmail] = useState('');
	const [userRegisterPassword, setUserRegisterPassword] = useState('');
	const [isValid, setIsValid] = useState(false);
	const [isVisited, setIsVisited] = useState(true);
	const shouldShowError = !isValid && isVisited;
	const [response, setResponse] = useState('');
	const [isRegisterValid, setIsRegisterValid] = useState(false);
	const [isRegisterVisited, setIsRegisterVisited] = useState(true);
	const shouldRegisterShowError = !isRegisterValid && isRegisterVisited;
	const [registerResponse, setRegisterResponse] = useState('');
	const [
		isRegisterSuccessModalOpen,
		setIsRegisterSuccessModalOpen,
	] = useState(false);

	useEffect(() => {
		document.body.style.background = isDarkTheme ? '#393939' : '#eeeeee';
	}, [isDarkTheme]);

	async function handleSubmit() {
		try {
			if (isUri(originalURL)) {
				setFetching(true);
				const { data } = await API.post('/url', {
					originalURL,
				});

				setIsShortened(true);
				setServerOriginalURL(data.data.originalURL);
				setShortenedURL(data.data.shortenedURL);
				setImg(data.QRCode);
				setOriginalURL('');
				setFetching(false);
			} else setIsOpen(true);
		} catch (err) {
			setIsOpen(true);
		} finally {
			setFetching(false);
		}
	}

	async function handleUserLogin(event) {
		event.preventDefault();

		try {
			if (validate(userLoginEmail) && userLoginPassword) {
				setLoginFetching(true);
				const { data } = await API.get(
					`/user/${userLoginEmail}/${userLoginPassword}`
				);

				if (!data.status) setResponse(data.message);
				else {
					setResponse('');
				}
			}
		} catch (err) {
		} finally {
			setLoginFetching(false);
		}
	}

	async function handleUserRegister() {
		try {
			if (validate(userRegisterEmail) && userRegisterPassword) {
				setRegisterFetching(true);
				const { data } = await API.post('/user', {
					userEmail: userRegisterEmail,
					userPassword: userRegisterPassword,
				});

				if (!data.status) setRegisterResponse(data.message);
				else {
					setRegisterResponse('');
					setIsRegisterSuccessModalOpen(true);
				}
			}
		} catch (err) {
		} finally {
			setRegisterFetching(false);
		}
	}

	function Negative() {
		const [css, theme] = useStyletron();

		return (
			<div
				className={css({
					display: 'flex',
					alignItems: 'center',
					paddingRight: theme.sizing.scale500,
					color: theme.colors.negative400,
				})}
			>
				<Alert title="Error" size="18px" />
			</div>
		);
	}

	function onChange(userLoginEmail) {
		setIsValid(validate(userLoginEmail));
		setUserLoginEmail(userLoginEmail);
	}

	function onRegisterChange(userRegisterEmail) {
		setIsRegisterValid(validate(userRegisterEmail));
		setUserRegisterEmail(userRegisterEmail);
	}

	return (
		<Provider value={engine}>
			<BaseProvider theme={isDarkTheme ? DarkTheme : LightTheme}>
				<HeaderNavigation style={{ paddingRight: '10px' }}>
					<StyledNavigationList $align={ALIGN.left}>
						<StyledNavigationItem
							style={{
								color: isDarkTheme ? '#fff' : '#000',
							}}
						>
							URL Shortener
						</StyledNavigationItem>
					</StyledNavigationList>

					<StyledNavigationList $align={ALIGN.center} />

					<StyledNavigationList $align={ALIGN.right}>
						<StyledNavigationItem>
							<StatefulTooltip
								accessibilityType="tooltip"
								content="Click here to sign in"
								placement={PLACEMENT.bottom}
							>
								<Button
									onClick={() => setLoginModalIsOpen(true)}
								>
									Sign in
								</Button>
							</StatefulTooltip>

							<StatefulTooltip
								accessibilityType="tooltip"
								content={`Switch current theme to ${
									!isDarkTheme ? 'Dark' : 'Light'
								} Theme`}
								placement={PLACEMENT.bottom}
							>
								<Button
									style={{ marginLeft: '10px' }}
									onClick={() => {
										localStorage.setItem(
											'darkTheme',
											!isDarkTheme
										);
										setIsDarkTheme(!isDarkTheme);
									}}
								>
									Switch Theme
								</Button>
							</StatefulTooltip>
						</StyledNavigationItem>
					</StyledNavigationList>
				</HeaderNavigation>

				<Container>
					<Card style={{ marginTop: '15px' }}>
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

						<StyledAction>
							<StatefulTooltip
								accessibilityType="tooltip"
								content="Short the pasted URL"
								placement={PLACEMENT.bottom}
							>
								<Button
									onClick={handleSubmit}
									isLoading={fetching}
									disabled={fetching}
								>
									Short URL
								</Button>
							</StatefulTooltip>
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
								<StatefulPopover
									placement={PLACEMENT.bottom}
									content={
										<Paragraph3 padding="scale500">
											Successfully copied!{' '}
											<span role="img" aria-label="Hands">
												👋
											</span>
										</Paragraph3>
									}
									accessibilityType="tooltip"
									showArrow
								>
									<Button>Copy URL</Button>
								</StatefulPopover>
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
								<StatefulTooltip
									accessibilityType="tooltip"
									content="QRCode"
									placement={PLACEMENT.bottom}
								>
									<img src={img} alt="QRCode" />
								</StatefulTooltip>
							</div>
						</Card>
					)}
				</Container>

				<Modal
					unstable_ModalBackdropScroll
					onClose={() => setLoginModalIsOpen(false)}
					isOpen={loginModalIsOpen}
					animate
					autoFocus
					role={ROLE.alertdialog}
				>
					<ModalHeader>Sign in</ModalHeader>

					<form onSubmit={e => handleUserLogin(e)} method="POST">
						<ModalBody>
							<FormControl
								label="Your email"
								error={
									shouldShowError
										? 'Please input a valid email address'
										: null
								}
							>
								<Input
									value={userLoginEmail}
									onChange={e => onChange(e.target.value)}
									onKeyUp={e => {
										if (e.which === 13) handleUserLogin();
									}}
									onBlur={() => setIsVisited(true)}
									error={shouldShowError}
									overrides={
										shouldShowError
											? { After: Negative }
											: {}
									}
									type="email"
									required
								/>
							</FormControl>

							<FormControl label="Your password">
								<Input
									value={userLoginPassword}
									onChange={e =>
										setUserLoginPassword(e.target.value)
									}
									onKeyUp={e => {
										if (e.which === 13) handleUserLogin();
									}}
									type="password"
									required
								/>
							</FormControl>

							<StyledLink
								href="#"
								onClick={() => {
									setLoginModalIsOpen(false);
									setRegisterModalIsOpen(true);
								}}
							>
								Don't you have an account? Sign up here!
							</StyledLink>
						</ModalBody>

						<ModalFooter
							style={{
								color: '#d44333',
								display: 'flex',
								justifyContent: 'space-between',
							}}
						>
							<p>{response}</p>
							<ModalButton
								type="submit"
								isLoading={loginFetching}
								disabled={loginFetching}
							>
								Sign in
							</ModalButton>
						</ModalFooter>
					</form>
				</Modal>

				<Modal
					unstable_ModalBackdropScroll
					onClose={() => setRegisterModalIsOpen(false)}
					isOpen={registerModalIsOpen}
					animate
					autoFocus
					role={ROLE.alertdialog}
				>
					<ModalHeader>Sign up</ModalHeader>

					<ModalBody>
						<FormControl
							label="Your email"
							error={
								shouldRegisterShowError
									? 'Please input a valid email address'
									: null
							}
						>
							<Input
								value={userRegisterEmail}
								onChange={e => onRegisterChange(e.target.value)}
								onKeyUp={e => {
									if (e.which === 13) handleUserRegister();
								}}
								onBlur={() => setIsRegisterVisited(true)}
								error={shouldRegisterShowError}
								overrides={
									shouldRegisterShowError
										? { After: Negative }
										: {}
								}
								type="email"
								required
							/>
						</FormControl>

						<FormControl label="Your password">
							<Input
								value={userRegisterPassword}
								onChange={e =>
									setUserRegisterPassword(e.target.value)
								}
								onKeyUp={e => {
									if (e.which === 13) handleUserRegister();
								}}
								type="password"
								required
							/>
						</FormControl>

						<StyledLink
							href="#"
							onClick={() => {
								setRegisterModalIsOpen(false);
								setLoginModalIsOpen(true);
							}}
						>
							Already have an account? Sign in here!
						</StyledLink>
					</ModalBody>

					<ModalFooter
						style={{
							color: '#d44333',
							display: 'flex',
							justifyContent: 'space-between',
						}}
					>
						<p>{registerResponse}</p>
						<ModalButton
							onClick={handleUserRegister}
							isLoading={registerFetching}
							disabled={registerFetching}
						>
							Sign up
						</ModalButton>
					</ModalFooter>
				</Modal>

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
						The URL provived on input is not a valid URL. Please,
						insert a valid URL and try again.
					</ModalBody>

					<ModalFooter>
						<ModalButton onClick={() => setIsOpen(false)}>
							OK
						</ModalButton>
					</ModalFooter>
				</Modal>

				<Modal
					unstable_ModalBackdropScroll
					onClose={() => setIsRegisterSuccessModalOpen(false)}
					isOpen={isRegisterSuccessModalOpen}
					animate
					autoFocus
					role={ROLE.alertdialog}
				>
					<ModalHeader>Success</ModalHeader>

					<ModalBody>
						Welcome! You've just created your account on our system.
						E-mail: {userRegisterEmail}.
					</ModalBody>

					<ModalFooter>
						<ModalButton
							onClick={() => setIsRegisterSuccessModalOpen(false)}
						>
							OK
						</ModalButton>
					</ModalFooter>
				</Modal>
			</BaseProvider>
		</Provider>
	);
}
