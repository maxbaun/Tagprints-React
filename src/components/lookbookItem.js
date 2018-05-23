import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Image from './image';

export default class LookbookItem extends Component {
	static propTypes = {
		url: PropTypes.string.isRequired,
		height: PropTypes.number.isRequired,
		width: PropTypes.number.isRequired,
		resolutions: PropTypes.object,
		sizes: PropTypes.object
	};

	static defaultProps = {
		resolutions: {},
		sizes: {}
	};

	render() {
		const {url, height, width, sizes, resolutions} = this.props;

		return (
			<div className="our-work-lookbook-item">
				<Image
					preload
					sizes={sizes}
					resolutions={resolutions}
					naturalWidth={width}
					naturalHeight={height}
					url={url}
					style={{
						height: '100%',
						width: '100%'
					}}
				/>
			</div>
		);
	}
}
