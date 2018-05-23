import {List, fromJS} from 'immutable';

import {imageLayouts, isGif} from './imageHelpers';

export function interleaveGalleries(lookbooks) {
	if (!lookbooks || !lookbooks.count || !lookbooks.count()) {
		return List();
	}

	const totalImages = getTotalImages(lookbooks);
	lookbooks = lookbooks.map(transformLookbookGallery);
	let lookbookIndex = 0;
	let images = List();
	let lookbookCount = lookbooks.map(() => 0);

	for (let i = 0; i < totalImages; i++) {
		const index = getNextIndex(lookbooks, lookbookIndex, lookbookCount);
		const lookbook = lookbooks.get(index);
		const skip = lookbookCount.get(index);
		const image = getNextImageFromLookbook(lookbook, skip);

		lookbookCount = lookbookCount.set(index, skip + 1);
		images = images.push(image);

		if (index + 1 === lookbooks.count()) {
			lookbookIndex = 0;
		} else {
			lookbookIndex = index + 1;
		}
	}

	return images;
}

export function combineGalleries(lookbooks) {
	return lookbooks.reduce(
		(list, lookbook) => list.concat(transformLookbookGallery(lookbook)),
		List()
	);
}

function getTotalImages(lookbooks) {
	return lookbooks.reduce((count, lookbook) => {
		const gallery = lookbook.getIn(['acf', 'gallery']);

		if (!gallery || !gallery.count || !gallery.count()) {
			return count;
		}

		return count + gallery.count();
	}, 0);
}

function getNextIndex(lookbooks, currentIndex, lookbookCount) {
	if (currentIndex >= lookbooks.count()) {
		currentIndex = 0;
	}

	const lookbook = lookbooks.get(currentIndex);
	const skip = lookbookCount.get(currentIndex);
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

	return lookbook.skip(skip).first();
}

function transformLookbookGallery(lookbook) {
	const gallery = lookbook.getIn(['acf', 'gallery']);

	if (!gallery) {
		return List();
	}

	return gallery.reduce((list, image) => {
		return list.push(transformLookbookImage(image, lookbook));
	}, List());
}

function transformLookbookImage(image, lookbook) {
	const fullUrl = image.get('url');
	const fullWidth = image.getIn(['mediaDetails', 'width']);
	const fullHeight = image.getIn(['mediaDetails', 'height']);
	const width = fullWidth;
	const height = fullHeight;

	return fromJS({
		key: fullUrl,
		url: fullUrl,
		width,
		height,
		full: image.getIn(['full', 'childImageSharp', 'sizes']),
		sizes: image.getIn(['thumbnail', 'childImageSharp', 'sizes']),
		layout:
			width === height ?
				imageLayouts.square :
				height > width ?
					imageLayouts.portait :
					imageLayouts.landscape,
		lookbook: lookbook.get('slug'),
		link: lookbook.getIn(['acf', 'link'])
	});
}
