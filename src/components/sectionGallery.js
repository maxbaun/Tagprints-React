import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Link from 'gatsby-link';

import {noop, clickPrevent} from '../utils/componentHelpers';
import {replaceLinks} from '../utils/wordpressHelpers';
import Image from './image';
import ImageGrid from './imageGrid';
import Lightbox from './lightbox';
import Fragment from './fragment';
import CSS from '../css/modules/sectionGallery.module.scss';

class GalleryItem extends Component {
	static propTypes = {
		classname: PropTypes.string,
		url: PropTypes.string.isRequired,
		height: PropTypes.number,
		width: PropTypes.number,
		preload: PropTypes.bool,
		sizes: PropTypes.object,
		resolutions: PropTypes.object,
		itemSpacing: PropTypes.number,
		contain: PropTypes.bool,
		acf: PropTypes.object
	};

	static defaultProps = {
		preload: false,
		classname: '',
		height: 0,
		width: 0,
		sizes: {},
		resolutions: {},
		itemSpacing: 7.5,
		contain: false,
		acf: {}
	};

	render() {
		const {height, width, url, sizes, resolutions, itemSpacing, acf} = this.props;

		const style = {
			padding: itemSpacing
		};

		const hasMeta = acf && ((acf.title && acf.title !== '') || (acf.description && acf.description !== ''));

		const meta = (
			<div className={CSS.galleryItemMeta}>
				<h3>{acf.title}</h3>
				<p>{acf.description}</p>
			</div>
		);

		return (
			<div className={CSS.galleryItem} style={style}>
				<div className={CSS.galleryItemInner}>
					{hasMeta ?
						<div className={CSS.galleryItemOverlay}>
							<div className={CSS.galleryItemOverlayInnerHover} onClick={this.props.onImageClick}>
								{meta}
							</div>
							<div className={CSS.galleryItemOverlayInnerTouch} onTouchStart={this.props.onImageClick}>
								{meta}
							</div>
						</div> : null
					}
					<Image
						preload
						inViewToggle
						placeholder
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
			</div>
		);
	}
}

export default class SectionGallery extends Component {
	constructor(props) {
		super(props);

		this.state = {
			width: 0,
			modalOpen: false,
			modalStart: 1
		};

		this.handleWindowResize = this.handleWindowResize.bind(this);
		this.handleModalClose = this.handleModalClose.bind(this);
		this.handleModalOpen = this.handleModalOpen.bind(this);
		this.handleImageClick = this.handleImageClick.bind(this);
	}

	static propTypes = {
		images: PropTypes.array.isRequired,
		link: PropTypes.object,
		children: PropTypes.element,
		classname: PropTypes.string,
		btnClass: PropTypes.string,
		itemSpacing: PropTypes.number
	};

	static defaultProps = {
		classname: '',
		children: null,
		btnClass: 'btn btn-cta',
		itemSpacing: 7.5,
		link: {}
	};

	componentDidMount() {
		this.handleWindowResize();

		window.addEventListener('resize', this.handleWindowResize);
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.handleWindowResize);
	}

	handleImageClick(image) {
		const index = this.props.images.findIndex(i => image.id === i.id);

		this.handleModalOpen(index);
	}

	handleWindowResize() {
		this.setState({
			width: document.body.clientWidth
		});
	}

	handleModalOpen(modalStart) {
		this.setState({
			modalOpen: true,
			modalStart
		});
	}

	handleModalClose() {
		this.setState({modalOpen: false});
	}

	render() {
		const {images, classname, contain} = this.props;
		const {width} = this.state;
		const isMobile = width < 1000;

		const filteredImages = width > 0 && isMobile ? images.slice(0, 8) : images;

		return (
			<Fragment>
				{this.state.modalOpen ? (
					<Lightbox images={filteredImages} open={this.state.modalOpen} start={this.state.modalStart} onClose={this.handleModalClose}/>
				) : null}
				<section className={[CSS.sectionGallery, CSS[classname]].join(' ')}>
					{contain ? <div className="container">{this.renderGallery(filteredImages)}</div> : this.renderGallery(filteredImages)}
				</section>
			</Fragment>
		);
	}

	renderGallery(images) {
		const {link, children, classname, btnClass, itemSpacing} = this.props;
		const {width} = this.state;

		const isMobile = width < 1000;
		const isImageMoreLink = classname === 'experienceGallery';

		return (
			<Fragment>
				{children ? children : null}
				<div className={CSS.gallery}>
					<ImageGrid
						items={images}
						itemSpacing={itemSpacing}
						component={GalleryItem}
						hasMore={false}
						onLoadMore={noop}
						windowWidth={width}
						onImageClick={this.handleImageClick}
					/>
				</div>
				{(isMobile && link && link.url) || isImageMoreLink ? (
					<div
						className={CSS.link}
						style={{
							textAlign: 'center',
							marginTop: 15
						}}
					>
						<Link className={isImageMoreLink ? '' : btnClass} to={replaceLinks(link.url)}>
							{link.title}
						</Link>
					</div>
				) : null}
			</Fragment>
		);
	}
}
