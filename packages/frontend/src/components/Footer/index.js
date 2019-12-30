import React, { memo } from 'react';
import {
	HeaderNavigation,
	ALIGN,
	StyledNavigationList,
	StyledNavigationItem,
} from 'baseui/header-navigation';

const year = new Date().getFullYear();

export default memo(function Footer({ isDarkTheme }) {
	return (
		<HeaderNavigation
			style={{
				borderTop: isDarkTheme
					? '1px solid rgb(41, 41, 41)'
					: '1px solid rgb(203, 203, 203)',
				borderBottom: 'none',
				padding: '10px 10px 10px 0',
			}}
		>
			<StyledNavigationList
				style={{ display: 'flex', justifyContent: 'space-between' }}
			>
				<StyledNavigationItem
					style={{
						color: isDarkTheme ? '#fff' : '#000',
					}}
				>
					Copyright © {year}
				</StyledNavigationItem>

				<StyledNavigationItem
					style={{
						color: isDarkTheme ? '#fff' : '#000',
					}}
				>
					Lucas Bittencourt
				</StyledNavigationItem>
			</StyledNavigationList>
		</HeaderNavigation>
	);
});
