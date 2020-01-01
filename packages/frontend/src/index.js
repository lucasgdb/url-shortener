import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom';

import { BrowserRouter, Switch, Route } from 'react-router-dom';

import { StyledSpinnerNext } from 'baseui/spinner';
import { Client } from 'styletron-engine-atomic';
import { Provider } from 'styletron-react';
import { LightTheme, BaseProvider, DarkTheme } from 'baseui';

import '~/styles.css';

const Home = lazy(() => import('~/pages/Home'));
const VisitURL = lazy(() => import('~/pages/VisitURL'));

const darkTheme = JSON.parse(localStorage.getItem('darkTheme'));
document.body.style.background = darkTheme ? '#393939' : '#eeeeee';

const engine = new Client();

ReactDOM.render(
	<Suspense
		fallback={
			<Provider value={engine}>
				<BaseProvider theme={darkTheme ? DarkTheme : LightTheme}>
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
			</Provider>
		}
	>
		<BrowserRouter>
			<Switch>
				<Route path="/" exact>
					<Home darkTheme={darkTheme} />
				</Route>

				<Route path="/:shortenedURL">
					<VisitURL isDarkTheme={darkTheme} />
				</Route>
			</Switch>
		</BrowserRouter>
	</Suspense>,
	document.getElementById('root')
);
