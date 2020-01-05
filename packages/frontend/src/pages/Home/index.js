import React, { useEffect, useState, useCallback } from 'react';
import { isUri } from 'valid-url';
import { validate } from 'email-validator';
import API from '~/services/api';

import Container from '~/components/Container';

import { Client } from 'styletron-engine-atomic';
import { Provider } from 'styletron-react';
import { LightTheme, BaseProvider, DarkTheme } from 'baseui';
import { Input } from 'baseui/input';
import { Button, KIND, SIZE } from 'baseui/button';
import { StyledLink } from 'baseui/link';
import { Card, StyledBody, StyledAction } from 'baseui/card';
import { Heading, HeadingLevel } from 'baseui/heading';
import { Paragraph3 } from 'baseui/typography';
import { FormControl } from 'baseui/form-control';
import { Alert } from 'baseui/icon';
import { useStyletron } from 'baseui';
import { StatefulPopover, PLACEMENT } from 'baseui/popover';
import { StatefulTooltip } from 'baseui/tooltip';
import { StyledSpinnerNext } from 'baseui/spinner';
import { DeleteAlt } from 'baseui/icon';
import { Pagination } from 'baseui/pagination';
import { Checkbox, STYLE_TYPE, LABEL_PLACEMENT } from 'baseui/checkbox';
import {
	HeaderNavigation,
	ALIGN,
	StyledNavigationList,
	StyledNavigationItem,
} from 'baseui/header-navigation';
import {
	Modal,
	ModalHeader,
	ModalBody,
	ModalFooter,
	ModalButton,
	ROLE,
} from 'baseui/modal';

import { CopyToClipboard } from 'react-copy-to-clipboard';

const engine = new Client();
const appConfig = require('~/config/app.json');

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
	const [allURLsFetching, setAllURLsFetching] = useState(false);
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
	const [isReady, setIsReady] = useState(false);
	const [isLogged, setIsLogged] = useState(false);
	const [URLs, setURLs] = useState([]);
	const [userID, setUserID] = useState(null);
	const [userEmail, setUserEmail] = useState(null);
	const [currentPage, setCurrentPage] = useState(1);

	const getAllURLs = useCallback(async () => {
		try {
			setAllURLsFetching(true);
			const { data } = await API.get('/url', {
				headers: {
					authorization: `Bearer ${localStorage.getItem('TOKEN')}`,
				},
			});

			setURLs(data);
		} catch (err) {
		} finally {
			setAllURLsFetching(false);
		}
	}, []);

	useEffect(() => {
		(async () => {
			const TOKEN = localStorage.getItem('TOKEN');

			if (TOKEN) {
				try {
					const { data } = await API.get(`/user/${TOKEN}`);

					setIsLogged(true);
					setUserID(data._id);
					setUserEmail(data.userEmail);
					getAllURLs();
				} catch (err) {
					localStorage.removeItem('TOKEN');
				} finally {
					setIsReady(true);
				}
			} else setIsReady(true);
		})();
	}, [getAllURLs]);

	useEffect(() => {
		document.body.style.background = isDarkTheme ? '#393939' : '#eeeeee';
		document.body.style.transition = 'background 0.1s';

		localStorage.setItem('darkTheme', isDarkTheme);
	}, [isDarkTheme]);

	async function handleSubmit() {
		try {
			if (isUri(originalURL)) {
				setFetching(true);
				const { data } = await API.post('/url', {
					originalURL,
					userID: isLogged ? userID : undefined,
				});

				setIsShortened(true);
				setServerOriginalURL(data.data.originalURL);
				setShortenedURL(data.data.shortenedURL);
				setImg(data.QRCode);
				setOriginalURL('');
				setFetching(false);

				if (isLogged) getAllURLs();
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

				localStorage.setItem('TOKEN', data.token);
				setIsLogged(true);
				setResponse('');
				setUserID(data._id);
				setUserEmail(data.userEmail);
				getAllURLs();
			}
		} catch (err) {
			setResponse(err.response.data.message);
		} finally {
			setLoginFetching(false);
		}
	}

	async function handleUserLogout() {
		localStorage.removeItem('TOKEN');
		setIsLogged(false);
		setLoginModalIsOpen(false);
		setUserLoginEmail('');
		setUserLoginPassword('');
		setIsValid(false);
	}

	async function handleUserRegister() {
		try {
			if (validate(userRegisterEmail) && userRegisterPassword) {
				setRegisterFetching(true);

				await API.post('/user', {
					userEmail: userRegisterEmail,
					userPassword: userRegisterPassword,
				});

				setRegisterResponse('');
				setIsRegisterSuccessModalOpen(true);
				setUserRegisterEmail('');
				setUserRegisterPassword('');
				setIsRegisterValid(false);
			}
		} catch (err) {
			setRegisterResponse(err.response.data.message);
		} finally {
			setRegisterFetching(false);
		}
	}

	async function handleRemoveURL(_id) {
		try {
			await API.delete(`/url/${_id}`, {
				headers: {
					authorization: `Bearer ${localStorage.getItem('TOKEN')}`,
				},
			});

			getAllURLs();
		} catch (err) {}
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
			{isReady ? (
				<BaseProvider theme={isDarkTheme ? DarkTheme : LightTheme}>
					<HeaderNavigation style={{ padding: '10px 10px 10px 0' }}>
						<StyledNavigationList $align={ALIGN.left}>
							<StyledNavigationItem
								style={{
									color: isDarkTheme ? '#fff' : '#000',
								}}
							>
								URL Shortener
								{isLogged ? ` - Logged user: ${userEmail}` : ''}
							</StyledNavigationItem>
						</StyledNavigationList>

						<StyledNavigationList $align={ALIGN.center} />

						<StyledNavigationList $align={ALIGN.right}>
							<StyledNavigationItem
								style={{
									display: 'flex',
									alignItems: 'center',
								}}
							>
								{!isLogged ? (
									<Button
										style={{ marginRight: '10px' }}
										size={SIZE.compact}
										onClick={() =>
											setLoginModalIsOpen(true)
										}
									>
										Sign in
									</Button>
								) : (
									<Button
										style={{ marginRight: '10px' }}
										size={SIZE.compact}
										onClick={handleUserLogout}
									>
										Sign out
									</Button>
								)}

								<Checkbox
									checked={isDarkTheme}
									checkmarkType={STYLE_TYPE.toggle_round}
									onChange={async e =>
										setIsDarkTheme(e.target.checked)
									}
									labelPlacement={LABEL_PLACEMENT.right}
								>
									Dark Theme
								</Checkbox>
							</StyledNavigationItem>
						</StyledNavigationList>
					</HeaderNavigation>

					<Container>
						<Card style={{ margin: '10px 0' }}>
							<StyledBody>
								<HeadingLevel>
									<Heading styleLevel={4}>
										URL Shortener
									</Heading>
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
							<Card
								style={{
									marginBottom: '10px',
									overflow: 'hidden',
								}}
							>
								<HeadingLevel>
									<Heading
										style={{
											display: 'flex',
											alignItems: 'center',
										}}
										styleLevel={4}
									>
										<Button
											kind={KIND.tertiary}
											style={{
												padding: 0,
												marginRight: '5px',
											}}
										>
											<DeleteAlt
												title=""
												style={{
													width: '30px',
													height: '30px',
												}}
												onClick={() =>
													setIsShortened(false)
												}
											/>
										</Button>
										Shortened URL
									</Heading>

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
											href={`${appConfig.baseURL}${shortenedURL}`}
											target="_blank"
										>
											{appConfig.baseURL}
											{shortenedURL}
										</StyledLink>
									</Paragraph3>
								</HeadingLevel>

								<CopyToClipboard
									text={`${appConfig.baseURL}${shortenedURL}`}
								>
									<StatefulPopover
										placement={PLACEMENT.bottom}
										content={
											<Paragraph3 padding="scale500">
												Successfully copied!{' '}
												<span
													role="img"
													aria-label="Hands"
												>
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

						{isLogged && (
							<Card style={{ marginBottom: '10px' }}>
								{allURLsFetching ? (
									<StyledSpinnerNext
										style={{
											position: 'relative',
											left: '50%',
											transform: 'translateX(-50%)',
										}}
									/>
								) : (
									<>
										<HeadingLevel>
											<Heading styleLevel={4}>
												Shortened URLs [{URLs.length}]
											</Heading>
										</HeadingLevel>

										{URLs.slice(
											(currentPage - 1) * 5,
											currentPage * 5
										).map(URL => (
											<Card
												key={URL._id}
												style={{
													marginTop: '5px',
													overflowX: 'hidden',
												}}
											>
												<div
													style={{
														display: 'flex',
														justifyContent:
															'space-between',
													}}
												>
													<div>
														<p
															style={{
																margin:
																	'0 0 1px',
															}}
														>
															Long URL:{' '}
															{URL.originalURL.substr(
																0,
																URL.originalURL
																	.length > 80
																	? 80
																	: Infinity
															)}
															{URL.originalURL
																.length > 80
																? '...'
																: ''}
														</p>

														<StyledLink
															href={`${appConfig.baseURL}${URL.shortenedURL}`}
															target="_blank"
														>
															{appConfig.baseURL}
															{URL.shortenedURL}
														</StyledLink>
													</div>

													<div
														style={{
															display: 'flex',
															alignItems:
																'center',
														}}
													>
														<CopyToClipboard
															text={`${appConfig.baseURL}${URL.shortenedURL}`}
														>
															<StatefulPopover
																placement={
																	PLACEMENT.bottom
																}
																content={
																	<Paragraph3 padding="scale500">
																		Successfully
																		copied!{' '}
																		<span
																			role="img"
																			aria-label="Hands"
																		>
																			👋
																		</span>
																	</Paragraph3>
																}
																accessibilityType="tooltip"
															>
																<Button>
																	Copy URL
																</Button>
															</StatefulPopover>
														</CopyToClipboard>

														<Button
															kind={KIND.tertiary}
															style={{
																padding: 0,
																marginLeft:
																	'10px',
															}}
															onClick={() =>
																handleRemoveURL(
																	URL._id
																)
															}
														>
															<DeleteAlt
																title=""
																style={{
																	width:
																		'30px',
																	height:
																		'30px',
																}}
															/>
														</Button>
													</div>
												</div>
											</Card>
										))}

										{URLs.length > 0 && (
											<div
												style={{
													display: 'flex',
													justifyContent: 'center',
													marginTop: '15px',
												}}
											>
												<Pagination
													numPages={Math.ceil(
														URLs.length / 5
													)}
													currentPage={currentPage}
													onPageChange={({
														nextPage,
													}) => {
														setCurrentPage(
															Math.min(
																Math.max(
																	nextPage,
																	1
																),
																Math.ceil(
																	URLs.length /
																		5
																)
															)
														);
													}}
												/>
											</div>
										)}
									</>
								)}
							</Card>
						)}
					</Container>

					{!isLogged && (
						<Modal
							unstable_ModalBackdropScroll
							onClose={() => setLoginModalIsOpen(false)}
							isOpen={loginModalIsOpen}
							animate
							autoFocus
							role={ROLE.alertdialog}
						>
							<ModalHeader>Sign in</ModalHeader>

							<form
								onSubmit={e => handleUserLogin(e)}
								method="POST"
							>
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
											onChange={e =>
												onChange(e.target.value)
											}
											onKeyUp={e => {
												if (e.which === 13)
													handleUserLogin(e);
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
												setUserLoginPassword(
													e.target.value
												)
											}
											onKeyUp={e => {
												if (e.which === 13)
													handleUserLogin(e);
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
					)}

					{!isLogged && (
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
										onChange={e =>
											onRegisterChange(e.target.value)
										}
										onKeyUp={e => {
											if (e.which === 13)
												handleUserRegister(e);
										}}
										onBlur={() =>
											setIsRegisterVisited(true)
										}
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
											setUserRegisterPassword(
												e.target.value
											)
										}
										onKeyUp={e => {
											if (e.which === 13)
												handleUserRegister();
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
					)}

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
							The URL provived on input is not a valid URL.
							Please, insert a valid URL and try again.
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
							Welcome! You've just created your account on our
							system.
						</ModalBody>

						<ModalFooter>
							<ModalButton
								onClick={() =>
									setIsRegisterSuccessModalOpen(false)
								}
							>
								OK
							</ModalButton>
						</ModalFooter>
					</Modal>
				</BaseProvider>
			) : (
				<BaseProvider theme={isDarkTheme ? DarkTheme : LightTheme}>
					<StyledSpinnerNext
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
			)}
		</Provider>
	);
}
