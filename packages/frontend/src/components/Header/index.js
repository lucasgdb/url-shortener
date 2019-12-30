import React, { memo } from 'react';
import {
	HeaderNavigation,
	ALIGN,
	StyledNavigationList,
	StyledNavigationItem,
} from 'baseui/header-navigation';
import { PLACEMENT } from 'baseui/popover';
import { StatefulTooltip } from 'baseui/tooltip';
import { Button, SIZE } from 'baseui/button';

export default memo(function Header({
	isDarkTheme,
	setIsDarkTheme,
	setLoginModalIsOpen,
}) {
	return (
		<HeaderNavigation style={{ padding: '10px 10px 10px 0' }}>
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
							size={SIZE.compact}
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
							size={SIZE.compact}
							style={{ marginLeft: '10px' }}
							onClick={() => {
								localStorage.setItem('darkTheme', !isDarkTheme);
								setIsDarkTheme(!isDarkTheme);
							}}
						>
							Switch Theme
						</Button>
					</StatefulTooltip>
				</StyledNavigationItem>
			</StyledNavigationList>
		</HeaderNavigation>
	);
});
