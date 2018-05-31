import React from 'react';
import PropTypes from 'prop-types';
import GatsbyLink from 'gatsby-link';

import {replaceLinks} from '../utils/wordpressHelpers';

const Link = ({children, to, ...other}) => {
	to = replaceLinks(to);
	const internal = /^\/(?!\/)/.test(to);

	// Use gatsby-link for internal links, and <a> for others
	if (internal) {
		return (
			<GatsbyLink to={to} {...other}>
				{children}
			</GatsbyLink>
		);
	}

	return (
		<a href={to} target="_blank" {...other}>
			{children}
		</a>
	);
};

Link.propTypes = {
	children: PropTypes.oneOfType([PropTypes.element, PropTypes.string]).isRequired,
	to: PropTypes.string.isRequired
};

export default Link;
