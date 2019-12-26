import React, { useState } from 'react';
import { Client as Styletron } from 'styletron-engine-atomic';
import { Provider as StyletronProvider } from 'styletron-react';
import { LightTheme, DarkTheme, BaseProvider, styled } from 'baseui';
import { StatefulInput } from 'baseui/input';
import { Button } from 'baseui/button';

const engine = new Styletron();

const Centered = styled('div', {
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
	height: '100%',
});

export default function Hello() {
	const [theme, setTheme] = useState(false);

	return (
		<StyletronProvider value={engine}>
			<BaseProvider theme={theme ? LightTheme : DarkTheme}>
				<Centered>
					<StatefulInput />
				</Centered>

				<Button
					style={{ marginTop: 20 }}
					onClick={() => setTheme(!theme)}
				>
					Mudar tema
				</Button>
			</BaseProvider>
		</StyletronProvider>
	);
}
