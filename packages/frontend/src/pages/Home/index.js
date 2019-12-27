import React, { useState } from 'react';
import { Client } from 'styletron-engine-atomic';
import { Provider } from 'styletron-react';
import { DarkTheme, BaseProvider } from 'baseui';
import { Input } from 'baseui/input';
import Container from '~/components/Container';

const engine = new Client();

export default function Home() {
	const [value, setValue] = useState('Olá, mundo!');

	return (
		<Provider value={engine}>
			<BaseProvider theme={DarkTheme}>
				<Container>
					<div>{value}</div>

					<Input
						placeholder="Teste"
						value={value}
						onChange={e => setValue(e.target.value)}
					/>
				</Container>
			</BaseProvider>
		</Provider>
	);
}
