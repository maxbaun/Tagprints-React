import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Img from 'gatsby-image';
import Visibility from 'react-visibility-sensor';

import {ImageLoader} from '../utils/imageHelpers';
import {noop} from '../utils/componentHelpers';

import CSS from '../css/modules/image.module.scss';
import Placeholder from './placeholder';
import Fragment from './fragment';

export default class Image extends Component {
	constructor(props) {
		super(props);

		this.state = {
			height: 0,
			width: 0,
			url: null,
			inView: false
		};

		this.imgLoader = null;
		this.loader = null;

		this.mounted = false;

		this.getImageLayout = this.getImageLayout.bind(this);
		this.renderGatsbyImage = this.renderGatsbyImage.bind(this);
		this.renderImage = this.renderImage.bind(this);
		this.toggleView = this.toggleView.bind(this);
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
		onLoad: PropTypes.func,
		inViewToggle: PropTypes.bool,
		imgStyle: PropTypes.object,
		onClick: PropTypes.func
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
		onLoad: noop,
		inViewToggle: false,
		imgStyle: {},
		onClick: noop
	};

	componentDidMount() {
		const {naturalHeight, naturalWidth, thumbnail, url} = this.props;

		const preloadUrl = !thumbnail || thumbnail === '' ? url : thumbnail;

		if (this.shouldPreload()) {
			this.preloadImage(preloadUrl);
		} else {
			this.setState({
				height: naturalHeight,
				width: naturalWidth,
				url
			});
		}

		this.mounted = true;
	}

	componentWillUnmount() {
		this.mounted = false;
		this.cancelLoad();
	}

	cancelLoad() {
		if (this.imgLoader) {
			this.imgLoader.cancel();
			this.imgLoader = null;
		}
	}

	shouldPreload() {
		const {preload, resolutions, sizes} = this.props;

		return preload && !resolutions.src && !sizes.src;
	}

	preloadImage(url) {
		this.imgLoader = new ImageLoader(url);
		this.imgLoader
			.getImage()
			.then(img => {
				if (!this.mounted) {
					return;
				}

				this.setState(prevState => ({...prevState, ...img}));
			})
			.catch(() => {});
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

	toggleView(inView) {
		this.setState({inView});

		if (!inView) {
			this.cancelLoad();
		}

		if (inView && !this.state.url && this.shouldPreload()) {
			this.preloadImage(this.props.url);
		}
	}

	render() {
		const {inView} = this.state;
		const {inViewToggle, onClick} = this.props;
		const isLocal = this.props.sizes.src || this.props.resolutions.src;
		const wrapCSS = [CSS.imageWrap, inViewToggle ? CSS.viewToggle : '', inViewToggle && inView ? CSS.inView : ''];
		return (
			<div className={wrapCSS.join(' ')} data-layout={this.getImageLayout()} style={this.props.style} onClick={onClick}>
				<Visibility partialVisibility onChange={this.toggleView}>
					{isLocal ? this.renderGatsbyImage() : this.renderImage()}
				</Visibility>
			</div>
		);
	}

	renderImage() {
		const {placeholder, imgStyle} = this.props;
		const {url} = this.state;
		const loaded = Boolean(url);

		return (
			<div style={{width: '100%', height: '100%'}}>
				{placeholder && !loaded ? (
					<div className={CSS.placeholder}>
						<Placeholder style={{height: '100%', width: '100%'}}/>
					</div>
				) : null}
				<figure className={[CSS.inner, loaded ? CSS.innerActive : ''].join(' ')}>{loaded ? <img src={url} style={imgStyle}/> : null}</figure>
			</div>
		);
	}

	renderGatsbyImage() {
		const {sizes, resolutions, onLoad, imgStyle} = this.props;
		const layout = this.getImageLayout();
		let imageStyle = {
			width: '100%',
			height: 'auto',
			margin: '0 auto',
			left: 0,
			right: 0
		};

		if (layout === 'portrait') {
			imageStyle = {
				...imgStyle,
				height: '100%',
				width: 'auto'
			};
		} else if (layout === 'landscape') {
			imageStyle = {
				...imgStyle,
				height: 'auto',
				width: '100%'
			};
		}

		imageStyle = {
			...imageStyle,
			...imgStyle
		};

		const style = {
			height: '100%',
			width: '100%'
		};

		if (resolutions.src) {
			return <Img resolutions={resolutions} onLoad={onLoad} style={style} imgStyle={imageStyle}/>;
		}

		if (sizes.src) {
			return <Img sizes={sizes} onLoad={onLoad} style={style} imgStyle={imageStyle}/>;
		}

		return null;
	}
}
