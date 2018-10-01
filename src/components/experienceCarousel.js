import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Swiper from 'swiper';

import CSS from '../css/modules/experienceCarousel.module.scss';
import ImageV2 from './imagev2';
import Link from './link';
import ScrollSpy from './scrollSpy';
import {innerHtml} from '../utils/wordpressHelpers';
import {ref, click} from '../utils/componentHelpers';

export default class ExperienceCarousel extends Component {
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
		slides: PropTypes.array,
		scrollTo: PropTypes.string.isRequired
	};

	static defaultProps = {
		slides: []
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
			slidesPerView: 1
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
		const {slides, scrollTo} = this.props;
		const {activeSlide} = this.state;

		return (
			<div ref={ref.call(this, 'wrap')} className={CSS.wrap}>
				<div className={CSS.carousel}>
					<div className="swiper-container">
						<div className="swiper-wrapper">
							{slides.map((slide, index) => {
								return (
									<div key={`${index}_${slide.content}`} className="swiper-slide">
										<div className={index === activeSlide ? CSS.slideActive : CSS.slide}>
											<div className={CSS.slideImage}>
												<ImageV2 image={slide.image} imgStyle={{height: '100%'}}/>
											</div>
											<div className={CSS.slideContent}>
												<div className="container">
													<div className={CSS.slideContentInner}>
														<div dangerouslySetInnerHTML={innerHtml(slide.content)} className={CSS.slideCopy}/>
														<ul className={CSS.slideLinks}>
															{slide.links &&
																slide.links.map((l, index) => {
																	const {link} = l;
																	const linkClass =
																		index === 0 ?
																			'btn btn-experience-orange-carousel' :
																			'btn btn-experience-outline-carousel';

																	return (
																		<li key={`${index}_${link.title}`} className={CSS.slideLink}>
																			<Link
																				className={linkClass}
																				to={link.url}
																				style={{display: 'block', paddingLeft: 0, paddingRight: 0}}
																			>
																				{link.title}
																			</Link>
																		</li>
																	);
																})}
														</ul>
													</div>
												</div>
											</div>
										</div>
									</div>
								);
							})}
						</div>
						<div className={CSS.pagination}>
							<div className="container">
								<div className={CSS.paginationInner}>
									<ul className={CSS.bullets}>
										{slides.map((slide, index) => {
											return (
												<li
													key={`${index}_${slide.content}`}
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
					<ScrollSpy target={scrollTo}>
						<a className={CSS.scrollTo}/>
					</ScrollSpy>
				</div>
			</div>
		);
	}
}
