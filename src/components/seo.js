import React from 'react';
import PropTypes from 'prop-types';

import Head from './head';
import {htmlToString} from '../utils/componentHelpers';

const Seo = ({currentPage, location, site}) => {
	return (
		<Head
			{...currentPage.yoast}
			site={site}
			location={location}
			defaultTitle={`${htmlToString(currentPage.title)}`}
			image={currentPage.image ? currentPage.image.url : null}
			excerpt={currentPage.excerpt}
		/>
	);
};

Seo.propTypes = {
	currentPage: PropTypes.object.isRequired,
	location: PropTypes.object.isRequired,
	site: PropTypes.object.isRequired
};

export default Seo;
