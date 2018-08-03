import React, {Component} from 'react';
import PropTypes from 'prop-types';
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
		resolutions: PropTypes.object,
		itemSpacing: PropTypes.number
	};

	static defaultProps = {
		preload: false,
		classname: '',
		height: 0,
		width: 0,
		sizes: {},
		resolutions: {},
		itemSpacing: 7.5
	};

	render() {
		const {height, width, url, sizes, resolutions, itemSpacing} = this.props;

		const style = {
			padding: itemSpacing
		};

		return (
			<div className={CSS.galleryItem} style={style}>
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
		const {images, link, children, classname, btnClass, itemSpacing} = this.props;
		const {width} = this.state;

		const isMobile = width < 1000;
		const filteredImages = width > 0 && isMobile ? images.slice(0, 8) : images;

		return (
			<Fragment>
				{this.state.modalOpen ? (
					<Lightbox images={filteredImages} open={this.state.modalOpen} start={this.state.modalStart} onClose={this.handleModalClose}/>
				) : null}
				<section className={[CSS.sectionGallery, CSS[classname]].join(' ')}>
					{children ? children : null}
					<div className={CSS.gallery}>
						<ImageGrid
							items={filteredImages}
							itemSpacing={itemSpacing}
							component={GalleryItem}
							hasMore={false}
							onLoadMore={noop}
							windowWidth={width}
							onImageClick={this.handleImageClick}
						/>
					</div>
					{isMobile && link && link.url ? (
						<div
							style={{
								textAlign: 'center',
								marginTop: 15
							}}
						>
							<Link className={btnClass} to={replaceLinks(link.url)}>
								{link.title}
							</Link>
						</div>
					) : null}
				</section>
			</Fragment>
		);
	}
}
