import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {fromJS} from 'immutable';
import Link from 'gatsby-link';

import {noop} from '../utils/componentHelpers';
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
		resolutions: PropTypes.object
	};

	static defaultProps = {
		preload: false,
		classname: '',
		height: 0,
		width: 0,
		sizes: {},
		resolutions: {}
	};

	render() {
		const {height, width, url, sizes, resolutions} = this.props;

		return (
			<div className={CSS.galleryItem}>
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
		link: PropTypes.object.isRequired,
		children: PropTypes.element.isRequired
	};

	componentDidMount() {
		this.handleWindowResize();

		window.addEventListener('resize', this.handleWindowResize);
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.handleWindowResize);
	}

	handleImageClick(image) {
		const index = this.props.images.findIndex(
			i => image.id === i.get('id')
		);

		this.handleModalOpen(index + 1);
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
		const {images, link, children} = this.props;
		const {width} = this.state;

		const isMobile = width < 1000;
		const filteredImages =
			width > 0 && isMobile ? fromJS(images).take(8) : fromJS(images);

		return (
			<Fragment>
				<Lightbox
					images={filteredImages.toJS()}
					open={this.state.modalOpen}
					start={this.state.modalStart}
					onClose={this.handleModalClose}
				/>
				<section className={CSS.sectionGallery}>
					{children}
					<div className={CSS.gallery}>
						<ImageGrid
							items={filteredImages}
							component={GalleryItem}
							hasMore={false}
							onLoadMore={noop}
							windowWidth={width}
							onImageClick={this.handleImageClick}
						/>
					</div>
					{isMobile ? (
						<div
							style={{
								textAlign: 'center',
								marginTop: 15
							}}
						>
							<Link
								className="btn btn-cta"
								to={replaceLinks(link.url)}
							>
								{link.title}
							</Link>
						</div>
					) : null}
				</section>
			</Fragment>
		);
	}
}
