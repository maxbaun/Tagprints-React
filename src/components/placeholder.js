import React from 'react';
import PropTypes from 'prop-types';

import CSS from '../css/modules/placeholder.module.scss';

const Placeholder = ({style, color}) => {
	const innerStyle = {};

	if (color) {
		innerStyle.backgroundColor = color;
	}

	return (
		<div className={CSS.placeholder} style={style}>
			<div className={[CSS.inner].join(' ')} style={innerStyle}/>
		</div>
	);
};

Placeholder.propTypes = {
	style: PropTypes.object,
	color: PropTypes.string
};

Placeholder.defaultProps = {
	style: {},
	color: ''
};

export default Placeholder;
