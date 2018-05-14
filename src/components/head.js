import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';

import {stripHtml} from '../utils/componentHelpers';
import Favicon from '../images/favicon.ico';
import Favicon16 from '../images/favicon-16x16.png';
import Favicon32 from '../images/favicon-32x32.png';
import AppleTouchIcon from '../images/apple-touch-icon.png';
import DefaultImage from '../images/updated-logos-x3.png';

const Head = ({title, defaultTitle, metaKeywords, metaDescription, canonical, noFollow, noIndex, ogDescription, ogImage, ogTitle, twitterTitle, twitterDescription, twitterImage, image, excerpt}) => {
	if (!metaDescription || metaDescription === '') {
		metaDescription = stripHtml(excerpt);
	}

	if (ogTitle === '') {
		ogTitle = title && title !== '' ? title : defaultTitle;
	}

	if (twitterTitle === '') {
		twitterTitle = title && title !== '' ? title : defaultTitle;
	}

	const meta = [
		{name: 'viewport', content: 'width=device-width, initial-scale=1.0'},
		{name: 'description', content: metaDescription},
		{name: 'keywords', content: metaKeywords},
		{property: 'og:type', content: 'website'},
		{property: 'og:locale', content: 'en_US'},
		{property: 'og:title', content: ogTitle},
		{property: 'og:description', content: ogDescription && ogDescription !== '' ? ogDescription : metaDescription},
		{property: 'og:image', content: ogImage && ogImage !== '' ? ogImage : image},
		{property: 'og:url', content: 'http://czonemusic.com'},
		{property: 'og:site_name', content: 'C-Zone Entertainment'},
		{property: 'twitter:card', content: 'summary'},
		{property: 'twitter:site', content: '@czonemusic'},
		{property: 'twitter:creator', content: '@czonemusic'},
		{property: 'twitter:title', content: twitterTitle},
		{property: 'twitter:description', content: twitterDescription && twitterDescription === '' ? metaDescription : twitterDescription},
		{property: 'twitter:image', content: twitterImage && twitterImage !== '' ? twitterImage : image},
		{property: 'robots', content: noIndex},
		{property: 'robots', content: noFollow}
	];

	const links = [
		{rel: 'canonical', href: canonical},
		{rel: 'shortcut icon', href: Favicon},
		{rel: 'icon', href: Favicon16, sizes: '16x16'},
		{rel: 'icon', href: Favicon32, sizes: '32x32'},
		{rel: 'apple-touch-icon', href: AppleTouchIcon, sizes: '180x180'}
	];

	return (
		<Helmet
			htmlAttributes={{lang: 'en', amp: undefined}}
			titleAttributes={{itemprop: 'name', lang: 'en'}}
			meta={meta.map(data => data.content && data.content !== '' ? data : {})}
			link={links.map(link => link.href && link.href !== '' ? link : {})}
		>
			<title>{title && title !== '' ? title : defaultTitle}</title>
		</Helmet>
	);
};

Head.propTypes = {
	location: PropTypes.object.isRequired,
	title: PropTypes.string,
	defaultTitle: PropTypes.string,
	metaKeywords: PropTypes.string,
	metaDescription: PropTypes.string,
	canonical: PropTypes.string,
	noFollow: PropTypes.string,
	noIndex: PropTypes.string,
	ogDescription: PropTypes.string,
	ogImage: PropTypes.string,
	ogTitle: PropTypes.string,
	twitterTitle: PropTypes.string,
	twitterDescription: PropTypes.string,
	twitterImage: PropTypes.string,
	image: PropTypes.string,
	excerpt: PropTypes.string
};

Head.defaultProps = {
	title: '',
	defaultTitle: '',
	metaDescription: '',
	metaKeywords: '',
	canonical: '',
	noFollow: '',
	noIndex: '',
	ogDescription: '',
	ogImage: '',
	ogTitle: '',
	twitterTitle: '',
	twitterDescription: '',
	twitterImage: '',
	image: DefaultImage,
	excerpt: ''
};

export default Head;
