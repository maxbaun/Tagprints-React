import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Img from 'gatsby-image';
import {noop, cancellable} from '../utils/componentHelpers';

export default class ImageV2 extends Component {
	constructor(props) {
		super(props);

		this.state = {
			loaded: false
		};

		this.handleImageLoad = this.handleImageLoad.bind(this);
		this.loader = null;
	}

	static propTypes = {
		image: PropTypes.object,
		style: PropTypes.object,
		imgStyle: PropTypes.object,
		onLoad: PropTypes.func,
		circle: PropTypes.bool,
		showPlaceholder: PropTypes.bool,
		spacer: PropTypes.bool
	};

	static defaultProps = {
		image: {},
		style: {},
		imgStyle: {},
		onLoad: noop,
		circle: false,
		showPlaceholder: false,
		spacer: true
	};

	componentDidMount() {
		// Const {image} = this.props;
		// Const sizes = image.localFile && image.localFile.childImageSharp ? image.localFile.childImageSharp.sizes : null;
		// const resolutions = image.localFile && image.localFile.childImageSharp ? image.localFile.childImageSharp.resolutions : null;

		if (this.props.image && this.props.image.url) {
			this.loader = cancellable(this.preloadImage(this.props.image.url));
			this.loader.then(this.handleImageLoad);
		}

		// SetTimeout(this.handleImageLoad, 1000);
	}

	componentWillUnmount() {
		if (this.loader) {
			this.loader.cancel();
		}
	}

	preloadImage(src) {
		return new Promise((resolve, reject) => {
			const img = new window.Image();
			img.onload = () => {
				if (!img) {
					return reject();
				}

				resolve();
			};
			img.onerror = () => resolve();
			img.src = src;

			if (img.complete) {
				return resolve();
			}
		});
	}

	handleImageLoad() {
		this.setState({loaded: true});
		this.props.onLoad();
	}

	render() {
		const {image, circle, spacer} = this.props;
		const {loaded} = this.state;

		if (!image) {
			return null;
		}

		const sizes = image.localFile && image.localFile.childImageSharp ? image.localFile.childImageSharp.sizes : null;
		const resolutions = image.localFile && image.localFile.childImageSharp ? image.localFile.childImageSharp.resolutions : null;

		const props = {...this.props};

		// If (sizes) {
		// 	return <Img {...props} sizes={sizes}/>;
		// }

		// if (resolutions) {
		// 	return <Img {...props} resolutions={resolutions}/>;
		// }

		const ratio = (image.mediaDetails.height * 100) / image.mediaDetails.width;

		return (
			<div
				style={{
					position: 'relative',
					overflow: 'hidden',
					width: '100%',
					height: '100%',
					...this.props.style
				}}
			>
				{spacer ? (
					<div
						style={{
							width: '100%',
							paddingBottom: `${ratio}%`
						}}
					/>
				) : null}
				{this.props.showPlaceholder ? (
					<div
						style={{
							backgroundColor: '#C3C3C3',
							width: '100%',
							height: '100%',
							position: 'absolute',
							left: 0,
							right: 0,
							top: 0,
							bottom: 0,
							transition: 'opacity 0.5s',
							opacity: loaded ? 0 : 0.2,
							borderRadius: circle ? '50%' : 0
						}}
					/>
				) : null}
				<img
					src={image.url}
					style={{
						position: 'absolute',
						top: 0,
						left: 0,
						opacity: loaded ? 1 : 0,
						visibility: loaded ? 'visible' : 'hidden',
						transition: 'opacity 0.15s',
						width: '100%',
						height: '100%',
						objectFit: 'cover',
						objectPosition: 'center center',
						...this.props.imgStyle
					}}
					onLoad={this.handleImageLoad}
				/>
			</div>
		);
	}
}
