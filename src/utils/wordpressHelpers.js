export const replaceLinks = str => {
	return str
		.replace('http://czone.info', '')
		.replace('https://czone.info', '')
		.replace('http://czonemusic.com', '')
		.replace('https://czonemusic.com', '');
};

export const replaceContent = content => {
	return replaceLinks(content);
};

export const innerHtml = content => {
	content = replaceContent(content);

	return {__html: content};
};

export const sortByMenuOrder = list => {
	if (!list) {
		return;
	}

	return list.sort((a, b) => {
		if (a.node) {
			return a.node.menuOrder - b.node.menuOrder;
		}

		return a.menuOrder - b.menuOrder;
	});
}
