// Export const setDataTheme = location => {
// 	const {pathname} = location;
// 	let dataTheme = 'default';

// 	if (pathname.includes('array13') && !pathname.includes('our-work')) {
// 		dataTheme = 'array13';
// 	}

// 	if (pathname.includes('photo') && pathname.includes('lite')) {
// 		dataTheme = 'photobooth-lite';
// 	}

// 	if (pathname.includes('photo') && pathname.includes('lite')) {
// 		dataTheme = 'photobooth-lite';
// 	}

// 	const body = document.querySelector('body');
// 	body.setAttribute('data-theme', dataTheme);
// };

export const setDataTheme = theme => {
	if (!theme || theme === '') {
		theme = 'default';
	}

	const themeToggles = Array.from(
		document.querySelectorAll('[data-theme-toggle]')
	);

	themeToggles.forEach(t => t.setAttribute('data-theme', theme));
};
