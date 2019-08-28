import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Swiper from 'swiper';

import CSS from '../css/modules/originalsCarousel.module.scss';
import ImageV2 from './imagev2';
import {ref, click} from '../utils/componentHelpers';

export default class OriginalsCarousel extends Component {
	constructor(props) {
		super(props);

		this.state = {
			activeSlide: 0
		};

		this.swiper = null;
		this.wrap = null;

		this.handleSlideChange = this.handleSlideChange.bind(this);
		this.handlePaginationClick = this.handlePaginationClick.bind(this);
	}

	static propTypes = {
		images: PropTypes.array
	};

	static defaultProps = {
		images: []
	};

	componentDidMount() {
		this.initSlider();
	}

	initSlider() {
		const container = this.wrap.querySelector('.swiper-container');
		const options = {
			centeredSlides: true,
			loop: false,
			direction: 'horizontal',
			slidesPerView: 1,
			simulateTouch: false,
			autoplay: {
				delay: 3000
			}
		};

		this.swiper = new Swiper(container, options);

		this.swiper.on('slideChange', this.handleSlideChange);
	}

	handleSlideChange() {
		this.setState({
			activeSlide: this.swiper.activeIndex
		});
	}

	handlePaginationClick(index) {
		this.swiper.slideTo(index);
	}

	render() {
		const {images} = this.props;
		const {activeSlide} = this.state;

		return (
			<div ref={ref.call(this, 'wrap')} className={CSS.wrap}>
				<div className={CSS.carousel}>
					<div className="swiper-container">
						<div className="swiper-wrapper">
							{images.map((image, index) => {
								return (
									<div key={`${index}_${image}`} className="swiper-slide">
										<div className={index === activeSlide ? CSS.slideActive : CSS.slide}>
											<div className={CSS.slideImage}>
												<ImageV2
													image={image}
													imgStyle={{
														objectFit: 'initial',
														height: 'auto'
													}}
													style={{
														height: 'auto'
													}}
												/>
											</div>
										</div>
									</div>
								);
							})}
						</div>
						<div className={CSS.pagination}>
							<ul className={CSS.bullets}>
								{images.map((image, index) => {
									return (
										<li
											key={`${index}_${image.content}`}
											onClick={click(this.handlePaginationClick, index)}
											className={index === activeSlide ? CSS.bulletActive : CSS.bullet}
										/>
									);
								})}
							</ul>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
