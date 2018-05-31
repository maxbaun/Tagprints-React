import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Swiper from 'swiper';
import Img from 'gatsby-image';

import {getLightboxImageObject} from '../utils/wordpressHelpers';
import Image from './image';
import {ref, click, noop} from '../utils/componentHelpers';
import CSS from '../css/modules/portfolioSlider.module.scss';

export default class PortfolioSlider extends Component {
	constructor(props) {
		super(props);

		const activeCategory = props.categories[props.activeCategory];

		this.state = {
			images: activeCategory ? this.transformImages(activeCategory) : [],
			title: activeCategory ? activeCategory.title : '',
			width: 0
		};

		this.swiper = null;
		this.wrapper = null;

		this.handleCategoryClicked = this.handleCategoryClicked.bind(this);
		this.handleResize = this.handleResize.bind(this);
		this.isMobile = this.isMobile.bind(this);
	}

	static propTypes = {
		categories: PropTypes.array,
		onCloseClicked: PropTypes.func,
		activeCategory: PropTypes.number
	};

	static defaultProps = {
		categories: [],
		onCloseClicked: noop,
		activeCategory: 0
	};

	componentDidMount() {
		setTimeout(() => {
			this.init();
		}, 150);

		this.handleResize();
		window.addEventListener('resize', this.handleResize);
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.activeCategory !== this.props.activeCategory) {
			this.handleCategoryClicked(nextProps.categories[nextProps.activeCategory]);
		}
	}

	componentWillUnmount() {
		this.destroy();
		window.addEventListener('resize', this.handleResize);
	}

	init() {
		if (!this.wrapper) {
			return;
		}

		if (this.swiper) {
			this.swiper.destroy();
		}

		const container = this.wrapper.querySelector('.swiper-container');
		const nextEl = this.wrapper.querySelector('.swiper-button-next');
		const prevEl = this.wrapper.querySelector('.swiper-button-prev');
		const pagination = this.wrapper.querySelector('.swiper-pagination');

		const defaultOptions = {
			centeredSlides: true,
			loop: false,
			direction: 'horizontal',
			pagination: {
				el: pagination,
				clickable: true
			},
			slidesPerView: 1,
			spaceBetween: 0,
			grabCursor: true,
			initialSlide: 0,
			autoHeight: true,
			navigation: {
				nextEl,
				prevEl
			}
		};

		this.swiper = new Swiper(container, defaultOptions);
		this.swiper.update();
	}

	destroy() {
		if (!this.swiper) {
			return;
		}

		this.swiper.destroy();
	}

	handleResize() {
		this.setState(
			{
				width: document.body.clientWidth
			},
			() => {
				if (this.swiper) {
					this.swiper.update();
				}
			}
		);
	}

	transformImages(category) {
		if (!category) {
			return [];
		}

		return category.images.map(getLightboxImageObject);
	}

	handleCategoryClicked(category) {
		this.setState(
			{
				images: this.transformImages(category),
				title: category.title
			},
			() => {
				if (this.swiper) {
					this.swiper.destroy();
				}

				this.init();
			}
		);
	}

	isMobile() {
		const {width} = this.state;

		return width < 992;
	}

	render() {
		const {images, title} = this.state;
		const {categories, onCloseClicked} = this.props;

		const isMobile = this.isMobile();

		return (
			<div className={CSS.wrap}>
				<div className={CSS.inner}>
					<div className={CSS.header}>
						<h3>{title}</h3>
						<button className={CSS.closeBtn} type="button" onClick={onCloseClicked}>
							<span className="fa fa-close"/>
						</button>
					</div>
					<div ref={ref.call(this, 'wrapper')} className={CSS.slider}>
						<div className="swiper-container">
							<div className="swiper-wrapper">
								{images.map(image => {
									const style = {
										height: isMobile ? 290 : 495
									};

									const imgStyle = {
										display: 'block',
										margin: '0 auto',
										height: '100%',
										width: 'auto',
										left: 0,
										right: 0,
										position: 'absolute',
										objectFit: 'cover',
										objectPosition: 'center center'
									};

									return (
										<div key={image.url} className="swiper-slide">
											{this.renderImage(image, style, imgStyle)}
										</div>
									);
								})}
							</div>
						</div>
						<div className={['swiper-button-prev', CSS.prev].join(' ')}>
							<span className="fa fa-angle-left"/>
						</div>
						<div className={['swiper-button-next', CSS.next].join(' ')}>
							<span className="fa fa-angle-right"/>
						</div>
						<div className={['swiper-pagination', CSS.pagination].join(' ')}/>
					</div>
					<div className={CSS.previewWrap}>
						<ul className={CSS.previewList}>
							{categories.map(category => {
								const featuredImage = getLightboxImageObject(category.featuredImage);
								const imgStyle = {
									height: '100%',
									width: '100%',
									display: 'block',
									position: 'absolute',
									objectFit: 'cover',
									objectPosition: 'center center',
									margin: '0 auto'
								};

								const style = {
									position: 'absolute',
									height: '100%',
									width: '100%',
									top: 0,
									left: 0
								};

								return (
									<li key={category.title} onClick={click(this.handleCategoryClicked, category)}>
										<div className={CSS.preview}>
											<div className={CSS.previewImage}>{this.renderImage(featuredImage, style, imgStyle)}</div>
											<div className={CSS.previewContent}>
												<span>{category.title}</span>
											</div>
										</div>
									</li>
								);
							})}
						</ul>
					</div>
				</div>
			</div>
		);
	}

	renderImage(image, style = {}, imgStyle = {}) {
		if (image.sizes.src) {
			return <Img style={style} imgStyle={imgStyle} sizes={image.sizes}/>;
		}

		return <Image preload inViewToggle placeholder {...image} style={style} imgStyle={imgStyle}/>;
	}
}
