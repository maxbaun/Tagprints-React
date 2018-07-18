import {imageLayouts} from './imageHelpers';

export function interleaveGalleries(lookbooks) {
	if (!lookbooks || !lookbooks.length) {
		return [];
	}

	const totalImages = getTotalImages(lookbooks);
	lookbooks = lookbooks.map(transformLookbookGallery);
	let lookbookIndex = 0;
	let images = [];
	let lookbookCount = lookbooks.map(() => 0);

	for (let i = 0; i < totalImages; i++) {
		const index = getNextIndex(lookbooks, lookbookIndex, lookbookCount);
		const lookbook = lookbooks[index];
		const skip = lookbookCount[index];
		const image = getNextImageFromLookbook(lookbook, skip);

		lookbookCount[index] = skip + 1;
		images.push(image);

		if (index + 1 === lookbooks.length) {
			lookbookIndex = 0;
		} else {
			lookbookIndex = index + 1;
		}
	}

	return images;
}

export function combineGalleries(lookbooks) {
	return lookbooks.reduce((list, lookbook) => list.concat(transformLookbookGallery(lookbook)), []);
}

function getTotalImages(lookbooks) {
	return lookbooks.reduce((count, lookbook) => {
		const gallery = lookbook.acf.gallery;

		if (!gallery || !gallery.length) {
			return count;
		}

		return count + gallery.length;
	}, 0);
}

function getNextIndex(lookbooks, currentIndex, lookbookCount) {
	if (currentIndex >= lookbooks.length) {
		currentIndex = 0;
	}

	const lookbook = lookbooks[currentIndex];
	const skip = lookbookCount[currentIndex];
	const nextImage = getNextImageFromLookbook(lookbook, skip);

	if (!lookbook || !nextImage) {
		return getNextIndex(lookbooks, currentIndex + 1, lookbookCount);
	}

	return currentIndex;
}

function getNextImageFromLookbook(lookbook, skip) {
	if (!lookbook) {
		return;
	}

	const skipped = lookbook.slice(skip);

	return skipped[0];
}

function transformLookbookGallery(lookbook) {
	const gallery = lookbook.acf.gallery;

	if (!gallery) {
		return [];
	}

	return gallery.reduce((list, image) => {
		list.push(transformLookbookImage(image, lookbook));
		return list;
	}, []);
}

function transformLookbookImage(image, lookbook) {
	const fullUrl = image.url;
	const fullWidth = image.mediaDetails.width;
	const fullHeight = image.mediaDetails.height;
	const width = fullWidth;
	const height = fullHeight;

	return {
		key: fullUrl,
		url: fullUrl,
		fullWidth: fullWidth,
		fullHeight: fullHeight,
		width,
		height,
		sizes: image && image.localFile && image.localFile.childImageSharp ? image.localFile.childImageSharp.sizes : {},
		layout: width === height ? imageLayouts.square : height > width ? imageLayouts.portait : imageLayouts.landscape,
		lookbook: lookbook.slug,
		link: lookbook.acf.link
	};
}
