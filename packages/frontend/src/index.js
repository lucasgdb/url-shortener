import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

const Home = lazy(() => import('./pages/Home'));
const WrongPage = lazy(() => import('./pages/404'));

ReactDOM.render(
	<Suspense fallback={<div>Carregando...</div>}>
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
