import React, {Component} from 'react';
import PropTypes from 'prop-types';
import graphql from 'graphql';
import Img from 'gatsby-image';
import Link from 'gatsby-link';

import {innerHtml, getLightboxImageObject} from '../utils/wordpressHelpers';
import {click} from '../utils/componentHelpers';
import Seo from '../components/seo';
import ScrollSpy from '../components/scrollSpy';
import Image from '../components/image';
import Lightbox from '../components/lightbox';
import CSS from '../css/modules/caseStudy.module.scss';

export default class CaseStudyTemplate extends Component {
	constructor(props) {
		super(props);

		this.state = {
			modalOpen: false,
			modalStart: 1
		};

		this.renderImages = this.renderImages.bind(this);
		this.getLightboxImages = this.getLightboxImages.bind(this);
		this.handleModalClose = this.handleModalClose.bind(this);
		this.handleModalOpen = this.handleModalOpen.bind(this);
	}

	static propTypes = {
		data: PropTypes.object.isRequired,
		location: PropTypes.object.isRequired,
		site: PropTypes.object.isRequired
	};

	getLightboxImages() {
		const {caseStudy} = this.props.data;

		return caseStudy.acf.images.map(i => i.image).map(getLightboxImageObject);
	}

	handleModalOpen(index) {
		this.setState({
			modalOpen: true,
			modalStart: index
		});
	}

	handleModalClose() {
		this.setState({
			modalOpen: false
		});
	}

	render() {
		const {caseStudy} = this.props.data;

		return (
			<div>
				<Seo currentPage={caseStudy} site={this.props.site} location={this.props.location}/>
				{this.state.modalOpen ? (
					<Lightbox
						images={this.getLightboxImages()}
						open={this.state.modalOpen}
						start={this.state.modalStart}
						onClose={this.handleModalClose}
					/>
				) : null}
				<main className="main" role="main">
					<div className={CSS.caseStudy}>
						<div className={CSS.hero}>
							<div className={CSS.heroImage}>
								{caseStudy.acf.heroOverlay ? <div className={CSS.overlay}/> : null}
								<Img sizes={caseStudy.acf.hero.localFile.childImageSharp.sizes}/>
							</div>
							<div className={CSS.heroInner}>
								<div className={CSS.scrollWrap}>
									<ScrollSpy target="#caseStudyContent">
										<div className={CSS.scroll}>
											<span className="fa fa-angle-down"/>
										</div>
									</ScrollSpy>
								</div>
							</div>
						</div>
						<div id="caseStudyContent" className={CSS.body}>
							<div className="container">
								<div className="row">
									<div className="col-sm-4">
										<div
											// eslint-disable-next-line react/no-danger
											dangerouslySetInnerHTML={innerHtml(caseStudy.content)}
											className={CSS.content}
										/>
									</div>
									<div className="col-sm-8">
										<div className={CSS.images}>{this.renderImages()}</div>
									</div>
								</div>
							</div>
							<div className={CSS.cta}>
								<Link to="/free-quote" className="btn btn btn-cta-transparent readmore">
									Free Quote
								</Link>
							</div>
						</div>
					</div>
				</main>
			</div>
		);
	}

	renderImages() {
		const {caseStudy} = this.props.data;

		return (
			<ul>
				{caseStudy.acf.images.map((data, index) => {
					const style = {
						width: `calc(100% / ${data.width})`
					};

					const image = data.image;

					if (!image) {
						return null;
					}

					const mediaDetails = image.mediaDetails;

					const sizes = image.localFile.childImageSharp ? image.localFile.childImageSharp.sizes : {};

					const props = {
						preload: true,
						naturalWidth: mediaDetails.width,
						naturalHeight: mediaDetails.height,
						url: image.url,
						sizes,
						imgStyle: {
							width: '100%',
							height: 'auto'
						}
					};

					return (
						<li key={image.id} style={style} onClick={click(this.handleModalOpen, index)}>
							<Image {...props}/>
						</li>
					);
				})}
			</ul>
		);
	}
}

import {CaseStudy, LargeImage} from '../utils/fragments'; //eslint-disable-line

export const pageQuery = graphql`
	query caseStudyQuery($id: String!) {
		caseStudy: wordpressWpCaseStudy(id: {eq: $id}) {
			...CaseStudy
			content
			yoast {
				...CaseStudyYoast
			}
			acf {
				hero: caseStudyHeroImage {
					...LargeImage
				}
				images: caseStudyImages {
					width
					image {
						...LargeImage
					}
				}
			}
		}
	}
`;
