import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Img from 'gatsby-image';

import {ImageLoader} from '../utils/imageHelpers';
import {noop} from '../utils/componentHelpers';

import Placeholder from './placeholder';

export default class Image extends Component {
	constructor(props) {
		super(props);

		this.state = {
			height: 0,
			width: 0,
			url: null
		};

		this.renderLightbox = this.renderLightbox.bind(this);
		this.getImageLayout = this.getImageLayout.bind(this);
		this.renderImage = this.renderImage.bind(this);
		this.renderGatsbyImage = this.renderGatsbyImage.bind(this);
	}

	static propTypes = {
		classname: PropTypes.string,
		style: PropTypes.object,
		url: PropTypes.string,
		thumbnail: PropTypes.string,
		naturalHeight: PropTypes.number,
		naturalWidth: PropTypes.number,
		preload: PropTypes.bool,
		placeholder: PropTypes.bool,
		lightbox: PropTypes.string,
		children: PropTypes.element, //eslint-disable-line
		sizes: PropTypes.object,
		resolutions: PropTypes.object,
		onLoad: PropTypes.func
	};

	static defaultProps = {
		url: null,
		lightbox: '',
		preload: false,
		placeholder: false,
		classname: '',
		thumbnail: '',
		naturalHeight: 0,
		naturalWidth: 0,
		style: {},
		sizes: {},
		resolutions: {},
		onLoad: noop
	};

	componentWillMount() {
		const {naturalHeight, naturalWidth, thumbnail, url} = this.props;

		const preloadUrl = !thumbnail || thumbnail === '' ? url : thumbnail;

		if (this.props.preload) {
			this.preloadImage(preloadUrl);
		} else {
			this.setState({
				height: naturalHeight,
				width: naturalWidth,
				url
			});
		}
	}

	preloadImage(url) {
		const imgLoader = new ImageLoader(url);
		imgLoader.getImage().then(img => {
			this.setState(prevState => ({...prevState, ...img}));
		});
	}

	getImageLayout() {
		const {height, width} = this.state;

		if (height === width) {
			return 'square';
		}

		if (height > width) {
			return 'portrait';
		}

		if (height < width) {
			return 'landscape';
		}

		return '';
	}

	render() {
		const {style, lightbox, sizes, resolutions} = this.props;
		const {url} = this.state;

		const showLightbox = Boolean(lightbox && lightbox !== '');

		if (sizes.src || resolutions.src) {
			return this.renderGatsbyImage();
		}

		const layout = this.getImageLayout();

		let wrapStyle = {...style};

		return (
			<div data-layout={this.getImageLayout()} style={wrapStyle}>
				<div
					data-active={url ? 'true' : 'false'}
					style={{height: '100%', width: '100%'}}
				>
					<figure style={{height: '100%', width: '100%'}}>
						{this.renderImage(url)}
					</figure>
				</div>
			</div>
		);
	}

	renderLightbox(thumbnail, lightbox) {
		const {url} = this.props;

		return (
			<a
				href={url}
				data-lightbox={lightbox}
				style={{height: '100%', width: '100%'}}
			>
				{this.renderImage(thumbnail)}
			</a>
		);
	}

	renderImage(url) {
		const {placeholder} = this.props;

		return url ? (
			<img src={url}/>
		) : placeholder ? (
			<Placeholder style={{height: '100%', width: '100%'}}/>
		) : null;
	}

	renderGatsbyImage() {
		const {sizes, resolutions, onLoad} = this.props;

		if (resolutions.src) {
			return <Img resolutions={resolutions} onLoad={onLoad}/>;
		}

		if (sizes.src) {
			return <Img sizes={sizes} onLoad={onLoad}/>;
		}

		return null;
	}
}
