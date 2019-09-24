import React from 'react';
import PropTypes from 'prop-types';

import CSS from '../css/modules/video.module.scss';

const Video = ({src, ratio, style}) => {
	const ratioCss = CSS[`video--${ratio}`];

	return (
		<div className={[CSS.video, ratioCss].join(' ')} style={style}>
			<iframe
				src={src}
				frameBorder="0"
			/>
		</div>
	);
};

Video.propTypes = {
	ratio: PropTypes.oneOf(['16-9', '4-3']),
	src: PropTypes.string.isRequired,
	style: PropTypes.object
};

Video.defaultProps = {
	ratio: '16-9',
	style: {}
};

export default Video;
