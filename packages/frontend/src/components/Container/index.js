import React from 'react';
import { styled } from 'baseui';

const Container = styled('div', {
	width: '90%',
	paddingRight: '15px',
	paddingLeft: '15px',
	marginRight: 'auto',
	marginLeft: 'auto',
	'@media (min-width: 576px)': {
		maxWidth: '540px',
	},
	'@media (min-width: 768px)': {
		maxWidth: '720px',
	},
	'@media (min-width: 992px)': {
		maxWidth: '960px',
	},
	'@media (min-width: 1200px)': {
		maxWidth: '1140px',
	},
});

export default ({ children }) => <Container>{children}</Container>;
