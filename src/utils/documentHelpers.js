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

export const getDataTheme = location => {
	const part = location.pathname.split('/')[1];

	if (!part || part === '') {
		return 'home';
	}

	if (part.includes('contact') || part.includes('free-quote') || part.includes('thanks')) {
		return 'contact';
	}

	if (part.includes('social-photo-booth-pro')) {
		return 'photobooth-pro';
	}

	if (part.includes('social-photo-booth-lite')) {
		return 'photobooth-lite';
	}

	if (part === 'array13') {
		return 'array13';
	}

	return 'default';
};
