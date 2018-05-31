export const replaceLinks = str => {
	return str
		.replace('http://tagprints.info', '')
		.replace('https://tagprints.info', '')
		.replace('http://tagprints.com', '')
		.replace('https://tagprints.com', '')
		.replace('http://admin.tagprints.com', '')
		.replace('https://admin.tagprints.com', '')
		.replace('http://tagprints.docksal', '')
		.replace('https://tagprints.docksal', '');
};

export const replaceContent = content => {
	return replaceLinks(content);
};

export const replaceIcons = content => {
	let match = content.match(/%.*?%/);

	while (match) {
		content = content.replace(
			match[0],
			`<span class="fa fa-${match[0].split('%')[1]}"></span>`
		);
		match = content.match(/%.*?%/);
	}

	return content;
};

export const innerHtml = content => {
	content = replaceContent(content);
	content = replaceIcons(content);

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
};

export const getLightboxImageObject = image => {
	const sizes =
		image.localFile && image.localFile.childImageSharp ?
			image.localFile.childImageSharp.sizes :
			{};

	const resolutions =
		image.localFile && image.localFile.childImageSharp ?
			image.localFile.childImageSharp.resolutions :
			{};

	return {
		url: image.url,
		sizes,
		resolutions,
		height: image.mediaDetails ? image.mediaDetails.height : 0,
		width: image.mediaDetails ? image.mediaDetails.width : 0,
		naturalHeight: image.mediaDetails ? image.mediaDetails.height : 0,
		naturalWidth: image.mediaDetails ? image.mediaDetails.width : 0
	};
};
