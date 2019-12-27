import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { Spinner } from 'baseui/spinner';

const Home = lazy(() => import('~/pages/Home'));
const WrongPage = lazy(() => import('~/pages/404'));

ReactDOM.render(
	<Suspense
		fallback={
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
		}
	>
		<BrowserRouter>
			<Switch>
				<Route path="/" exact>
					<Home />
				</Route>

				<Route path="*">
					<WrongPage />
				</Route>
			</Switch>
		</BrowserRouter>
	</Suspense>,
	document.getElementById('root')
);
