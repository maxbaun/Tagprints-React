import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Img from 'gatsby-image';

import {getLightboxImageObject} from '../utils/wordpressHelpers';
import {click} from '../utils/componentHelpers';
import Modal from './modal';
import PortfolioSlider from './portfolioSlider';
import CSS from '../css/modules/sectionPortfolio.module.scss';

export default class sectionPortfolio extends Component {
	constructor(props) {
		super(props);

		this.state = {
			modalOpen: false,
			activeCategory: 0
		};

		this.handleCategoryClicked = this.handleCategoryClicked.bind(this);
		this.handleModalOpen = this.handleModalOpen.bind(this);
		this.handleModalClose = this.handleModalClose.bind(this);
	}

	static propTypes = {
		title: PropTypes.string,
		classname: PropTypes.string,
		categories: PropTypes.array,
		modalClass: PropTypes.string
	};

	static defaultProps = {
		title: '',
		classname: '',
		categories: [],
		modalClass: ''
	};

	handleCategoryClicked(index) {
		this.handleModalOpen(index);
	}

	handleModalOpen(activeCategory) {
		this.setState({
			modalOpen: true,
			activeCategory
		});
	}

	handleModalClose() {
		this.setState({modalOpen: false});
	}

	render() {
		const {modalOpen, activeCategory} = this.state;
		const {classname, title, categories, modalClass} = this.props;

		const wrapClass = [CSS.section, CSS[classname]];

		return (
			<section className={wrapClass.join(' ')}>
				<Modal size="full" active={modalOpen} onClose={this.handleModalClose} classname={modalClass} fogOpacity={0.9}>
					<div className={CSS.modalWrap}>
						<div className={CSS.modalInner}>
							<PortfolioSlider categories={categories} activeCategory={activeCategory} onCloseClicked={this.handleModalClose}/>
						</div>
					</div>
				</Modal>
				<div className="container">
					<div className={CSS.inner}>
						<div className={CSS.sectionHeader}>
							<h3 className={CSS.sectionTitle}>{title}</h3>
						</div>
						<div className={CSS.sectionContent}>
							<ul className={CSS.grid}>
								{categories &&
									categories.map((category, index) => {
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
											<li key={category.title} onClick={click(this.handleCategoryClicked, index)}>
												<div className={CSS.card}>
													<div className={CSS.cardImage}>
														{featuredImage.sizes.src ? (
															<Img style={style} imgStyle={imgStyle} sizes={featuredImage.sizes}/>
														) : (
															<div style={style}>
																<img src={featuredImage.url} style={imgStyle}/>
															</div>
														)}
													</div>
													<div className={CSS.cardOverlay}>
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
			</section>
		);
	}
}
