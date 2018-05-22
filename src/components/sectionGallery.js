import React, {Component} from 'react';
import PropTypes from 'prop-types';
import * as ImmutablePropTypes from 'react-immutable-proptypes';
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
		lightbox: PropTypes.string.isRequired,
		thumbnail: PropTypes.string.isRequired,
		children: PropTypes.element //eslint-disable-line
	};

	static defaultProps = {
		preload: false,
		classname: '',
		height: 0,
		width: 0
	};

	render() {
		const {height, width, url, thumbnail, lightbox} = this.props;

		return (
			<div className={CSS.galleryItem}>
				<Image
					preload
					placeholder
					lightbox={lightbox}
					thumbnail={thumbnail}
					url={url}
					naturalWidth={width}
					naturalHeight={height}
					style={{
						height,
						width
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
		this.getLightboxImages = this.getLightboxImages.bind(this);
		this.handleModalClose = this.handleModalClose.bind(this);
		this.handleModalOpen = this.handleModalOpen.bind(this);
		this.handleImageClick = this.handleImageClick.bind(this);
	}

	static propTypes = {
		images: ImmutablePropTypes.list.isRequired,
		link: ImmutablePropTypes.map.isRequired,
		children: PropTypes.element.isRequired
	};

	componentDidMount() {
		this.handleWindowResize();

		window.addEventListener('resize', this.handleWindowResize);
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.handleWindowResize);
	}

	getLightboxImages() {
		const images = this.props.images.toJS();

		const gridImages = images.map(image => {
			return {
				thumbnail: image.thumbnail,
				url: image.url
			};
		});

		return gridImages;
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
		const filteredImages = isMobile ? images.take(8) : images;

		return (
			<Fragment>
				<Lightbox
					images={this.getLightboxImages()}
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
								to={replaceLinks(link.get('url'))}
							>
								{link.get('title')}
							</Link>
						</div>
					) : null}
				</section>
			</Fragment>
		);
	}
}
