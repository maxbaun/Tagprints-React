import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Swiper from 'swiper';

import {ref} from '../utils/componentHelpers';
import Image from './imagev2';
import Modal from './modal';
import Video from './video';
import CSS from '../css/modules/lightbox.module.scss';

export default class Lightbox extends Component {
	constructor(props) {
		super(props);

		this.state = {
			height: 0,
			width: 0,
			initialized: false
		};

		this.swiper = null;
		this.wrapper = null;
		this.next = null;
		this.prev = null;

		this.handleNextClick = this.handleNextClick.bind(this);
		this.handlePrevClick = this.handlePrevClick.bind(this);
		this.handleModalClose = this.handleModalClose.bind(this);
		this.handleModalShow = this.handleModalShow.bind(this);
		this.handleResize = this.handleResize.bind(this);
		this.currentIndex = this.currentIndex.bind(this);
	}

	static propTypes = {
		images: PropTypes.array,
		open: PropTypes.bool,
		start: PropTypes.number,
		onClose: PropTypes.func,
		onShow: PropTypes.func
	};

	static defaultProps = {
		images: [],
		open: false,
		start: 1,
		onClose: () => {},
		onShow: () => {}
	};

	componentDidMount() {
		// This.init();
		this.handleResize();
		window.addEventListener('resize', this.handleResize);
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.start !== this.props.start) {
			this.goToSlide(nextProps.start);
		}
	}

	componentWillUnmount() {
		this.destroy();

		window.removeEventListener('resize', this.handleResize);
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

		const defaultOptions = {
			centeredSlides: true,
			direction: 'horizontal',
			pagination: false,
			slidesPerView: 1,
			spaceBetween: 0,
			grabCursor: true,
			initialSlide: this.props.start,
			navigation: {
				nextEl,
				prevEl
			}
		};

		this.swiper = new Swiper(container, defaultOptions);
		this.swiper.update();

		this.setState({
			initialized: true
		});
	}

	destroy() {
		if (!this.swiper) {
			return;
		}

		this.swiper.destroy();
		this.swiper = null;
		this.slider = null;
	}

	goToSlide(index) {
		if (!this.swiper) {
			return;
		}

		this.swiper.slideTo(index, 0);
	}

	currentIndex() {
		if (!this.swiper) {
			return 0;
		}

		return this.swiper.realIndex;
	}

	handleResize() {
		this.setState({
			height: window.innerHeight,
			width: window.innerWidth
		});
	}

	handlePrevClick() {
		this.swiper.slidePrev();
	}

	handleNextClick() {
		this.swiper.slideNext();
	}

	handleModalClose() {
		this.props.onClose();
	}

	handleModalShow() {
		// If the display is none on the modal, the swiper will not fully initialize
		// This.init();
		this.init();

		this.props.onShow();
	}

	render() {
		const {images, open} = this.props;
		const {height, width, initialized} = this.state;

		return (
			<Modal
				showClose
				size="full"
				active={open}
				onClose={this.handleModalClose}
				onShow={this.handleModalShow}
			>
				<div ref={ref.call(this, 'wrapper')} className={CSS.wrapper}>
					<div className="swiper-container" style={{height: '100%'}}>
						<div className="swiper-wrapper" style={{height: '100%'}}>
							{images.map(image => {
								let imgStyle = {
									maxHeight: image.mediaDetails.height ?
										image.mediaDetails.height :
										'100%',
									maxWidth: image.mediaDetails.width ?
										image.mediaDetails.width :
										'100%',
									right: 0,
									left: 0,
									margin: '0 auto'
								};

								if (height < width) {
									imgStyle = {
										...imgStyle,
										margin: '0 auto',
										width: 'auto',
										position: 'relative',
										height: '100%'
									};
								} else if (width < height) {
									imgStyle = {
										...imgStyle,
										width: '100%',
										height: 'auto',
										position: 'relative'
									};
								}

								return (
									<div
										key={image.id}
										className="swiper-slide"
										style={{
											textAlign: 'center',
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											position: 'relative',
											opacity: initialized ? 1 : 0,
											transform: initialized ? 'scale(1)' : 'scale(0.95)',
											transition: 'opacity 0.15s ease-in-out, transform 0.15s ease-in-out'
										}}
									>
										{image.video ? (
											<Video
												src={image.video}
												style={{
													height: '100%',
													width: '100%',
													maxWidth: 792,
													display: 'flex',
													alignItems: 'center',
													justifyContent: 'center'
												}}
											/>
										) : (
											<Image
												spacer={false}
												image={image}
												style={{
													height: '100%',
													width: '100%',
													display: 'flex',
													alignItems: 'center',
													justifyContent: 'center'
												}}
												imgStyle={imgStyle}
											/>
										)}
										{/* {image.sizes && image.sizes.src ? (
											<Img sizes={image.sizes} style={{height: '100%'}} imgStyle={imgStyle}/>
										) : (
											<img src={image.url} style={imgStyle}/>
										)} */}
									</div>
								);
							})}
						</div>
					</div>
					<div className={[CSS.prev, 'swiper-button-prev'].join(' ')}>
						<span className="fa fa-angle-left"/>
					</div>
					<div className={[CSS.next, 'swiper-button-next'].join(' ')}>
						<span className="fa fa-angle-right"/>
					</div>
				</div>
			</Modal>
		);
	}
}
