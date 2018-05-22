import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Swiper from 'swiper';

import {click, ref} from '../utils/componentHelpers';
import {innerHtml} from '../utils/wordpressHelpers';
import Image from './image';
import CSS from '../css/modules/sectionSlider.module.scss';

export default class SectionSlider extends Component {
	constructor(props) {
		super(props);

		this.state = {
			currentIndex: 1
		};

		this.slider = null;
		this.swiper = null;

		this.currentIndex = this.currentIndex.bind(this);
		this.handleSlideChange = this.handleSlideChange.bind(this);
		this.handlePaginationClick = this.handlePaginationClick.bind(this);
	}

	static propTypes = {
		id: PropTypes.string,
		slides: PropTypes.array,
		images: PropTypes.array.isRequired,
		children: PropTypes.element.isRequired,
		socialTitle: PropTypes.string,
		sectionClass: PropTypes.string
	};

	static defaultProps = {
		id: 'sectionSlider',
		slides: [],
		socialTitle: null,
		sectionClass: null
	};

	componentDidMount() {
		this.updateSlider();
	}

	componentWillUpdate(nextProps) {
		if (nextProps.slides !== this.props.slides) {
			this.updateSlider();
		}
	}

	componentWillUnmount() {
		if (this.swiper) {
			this.swiper.off('slideChange');
		}

		this.swiper = null;
		this.slider = null;
	}

	updateSlider() {
		const container = this.slider.querySelector('.swiper-container');
		const options = {
			centeredSlides: false,
			loop: true,
			direction: 'horizontal',
			slidesPerView: 1
		};

		this.swiper = new Swiper(container, options);

		this.swiper.on('slideChange', this.handleSlideChange);
	}

	currentIndex() {
		if (!this.swiper) {
			return 0;
		}

		return this.swiper.activeIndex;
	}

	handleSlideChange() {
		this.setState({
			currentIndex: this.swiper.activeIndex
		});
	}

	handlePaginationClick(index) {
		this.swiper.slideTo(index);
	}

	render() {
		const {
			images,
			socialTitle,
			slides,
			children,
			id,
			sectionClass
		} = this.props;
		const {currentIndex} = this.state;

		const image = images[0];

		const wrapClass = [CSS.section, CSS[sectionClass]];

		return (
			<div id={id} className={wrapClass.join(' ')}>
				<div className="container">
					<div className={CSS.inner}>
						<div className={CSS.image}>
							<Image
								sizes={image.localFile.childImageSharp.sizes}
								url={image.url}
								naturalWidth={image.mediaDetails.width}
								naturalHeight={image.mediaDetails.height}
							/>
						</div>
						<div className={CSS.content}>
							{children}
							<div className={CSS.slider}>
								<div
									ref={ref.call(this, 'slider')}
									className={CSS.carousel}
								>
									<div className={CSS.carouselWrap}>
										<div className={CSS.carouselInner}>
											<div className="swiper-container">
												<ul
													className={
														CSS.carouselPagination
													}
												>
													{slides.map(
														(slide, index) => {
															return (
																<li
																	key={
																		slide.content
																	}
																	className={
																		index ===
																		currentIndex -
																			1 ?
																			CSS.activePage :
																			CSS.page
																	}
																	onClick={click(
																		this
																			.handlePaginationClick,
																		index +
																			1
																	)}
																>
																	<span/>
																</li>
															);
														}
													)}
												</ul>
												<div className="swiper-wrapper">
													{slides.map(slide => {
														return (
															<div
																key={
																	slide.content
																}
																className="swiper-slide"
															>
																{/* eslint-disable react/no-danger */}
																<div
																	dangerouslySetInnerHTML={innerHtml(
																		slide.content
																	)}
																	className={
																		CSS.carouselSlide
																	}
																/>
																{/* eslint-enable react/no-danger */}
															</div>
														);
													})}
												</div>
											</div>
										</div>
										<div className={CSS.carouselBullets}>
											<ul>
												{slides.map((slide, index) => {
													return (
														<li
															key={slide.content}
															className={
																index ===
																currentIndex - 1 ?
																	CSS.activeBullet :
																	CSS.bullet
															}
															onClick={click(
																this
																	.handlePaginationClick,
																index + 1
															)}
														>
															<span>
																{index + 1}
															</span>
														</li>
													);
												})}
											</ul>
										</div>
									</div>
								</div>
								<div className={CSS.socialSharing}>
									<ul>
										<li>
											<span className="fa fa-facebook"/>
										</li>
										<li>
											<span className="fa fa-instagram"/>
										</li>
										<li>
											<span className="fa fa-twitter"/>
										</li>
										<li>
											<span className="fa fa-envelope"/>
										</li>
										<li>
											<span className="fa fa-commenting"/>
										</li>
										<li>
											<h5>{socialTitle}</h5>
										</li>
									</ul>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
