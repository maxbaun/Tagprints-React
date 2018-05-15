import React, {Component} from 'react';
import PropTypes from 'prop-types';
import graphql from 'graphql';
import Img from 'gatsby-image';
import Link from 'gatsby-link';

import {innerHtml, replaceLinks} from '../utils/wordpressHelpers';
import {initPageElements} from '../utils/documentHelpers';
import {chunk} from '../utils/componentHelpers';
import Seo from '../components/seo';
import CSS from '../css/modules/hashtag.module.scss';

export default class PageTemplate extends Component {
	constructor(props) {
		super(props);

		this.state = {
			heroLoaded: false
		};

		this.renderHero = this.renderHero.bind(this);
		this.renderSteps = this.renderSteps.bind(this);
		this.renderImage1 = this.renderImage1.bind(this);
		this.renderFeatures = this.renderFeatures.bind(this);
		this.renderImage2 = this.renderImage2.bind(this);
		this.handleHeroLoad = this.handleHeroLoad.bind(this);
	}

	static propTypes = {
		data: PropTypes.object.isRequired,
		location: PropTypes.object.isRequired
	};

	componentDidMount() {
		initPageElements();
	}

	handleHeroLoad() {
		this.setState({
			heroLoaded: true
		});
	}

	render() {
		const {currentPage, site} = this.props.data;

		return (
			<div>
				<Seo
					currentPage={currentPage}
					site={site}
					location={this.props.location}
				/>
				{this.renderHero()}
				{this.renderSteps()}
				{this.renderImage1()}
				{this.renderCta()}
				{this.renderFeatures()}
				{this.renderImage2()}
				{this.renderCta({marginBottom: 30})}
				{/* <main
					dangerouslySetInnerHTML={innerHtml(currentPage.content)} // eslint-disable-line react/no-danger
					className="main"
					role="main"
				/> */}
			</div>
		);
	}

	renderHero() {
		const {currentPage} = this.props.data;

		const {heroLoaded} = this.state;

		const {hero} = currentPage.acf;

		let btnClass = ['btn', 'btn-cta'];
		let titleClass = [];

		if (heroLoaded) {
			titleClass = titleClass.concat([
				'animated',
				'bounceInUp',
				'loaded',
				CSS.loaded
			]);
			btnClass = btnClass.concat(['animated', 'zoomInUp', CSS.loaded]);
		}

		return (
			<div className={heroLoaded ? CSS.heroLoaded : CSS.hero}>
				<div className={CSS.heroInner}>
					<div className={CSS.heroImage}>
						<Img
							sizes={hero.image.localFile.childImageSharp.sizes}
							onLoad={this.handleHeroLoad}
						/>
					</div>
					{heroLoaded ? (
						<div className={CSS.heroContent}>
							<h1 className={titleClass.join(' ')}>
								{hero.title}
							</h1>
							<Link
								to={replaceLinks(hero.link.url)}
								className={btnClass.join(' ')}
							>
								{hero.link.title}
							</Link>
						</div>
					) : null}
				</div>
			</div>
		);
	}

	renderSteps() {
		const {steps} = this.props.data.currentPage.acf;

		return (
			<section className={CSS.steps}>
				<div className="container">
					<div className="row">
						{steps &&
							steps.steps &&
							steps.steps.map(step => {
								return (
									<div key={step.title} className="col-sm-4">
										<div className={CSS.step}>
											<Img
												sizes={
													step.image.localFile
														.childImageSharp.sizes
												}
												style={{
													marginBottom: 20
												}}
											/>
											<h3>{step.title}</h3>
											<p>{step.tag}</p>
										</div>
									</div>
								);
							})}
					</div>
				</div>
			</section>
		);
	}

	renderImage1() {
		const {
			image1: {image}
		} = this.props.data.currentPage.acf;

		console.log(image);

		return (
			<section className={CSS.image1}>
				<div className="container">
					<Img sizes={image.localFile.childImageSharp.sizes}/>
				</div>
			</section>
		);
	}

	renderCta(style = {}) {
		const {
			cta: {link}
		} = this.props.data.currentPage.acf;

		return (
			<div className={CSS.cta}>
				<Link
					to={replaceLinks(link.url)}
					className="btn btn-cta"
					style={style}
				>
					{link.title}
				</Link>
			</div>
		);
	}

	renderImage2() {
		const {
			image2: {image}
		} = this.props.data.currentPage.acf;

		console.log(image);

		return (
			<section className={CSS.image2}>
				<Img
					sizes={image.localFile.childImageSharp.sizes}
					style={{
						marginTop: -175
					}}
				/>
			</section>
		);
	}

	renderFeatures() {
		const {
			features: {features}
		} = this.props.data.currentPage.acf;

		// Const rows = chunk(features, 3);

		return (
			<div className={CSS.features}>
				<div className={CSS.featuresInner}>
					<div className="row">
						{features.map((item, itemIndex) => {
							return (
								<div
									key={itemIndex} //eslint-disable-line
									className="col-xs-6 col-sm-4"
								>
									<div className={CSS.feature}>
										<i className={`icomoon-${item.icon}`}/>
										<p
											// eslint-disable-next-line react/no-danger
											dangerouslySetInnerHTML={innerHtml(
												item.text
											)}
										/>
									</div>
								</div>
							);
						})}
					</div>
				</div>
			</div>
		);
	}
}

export const pageQuery = graphql`
	query hashtagPageQuery($id: String!) {
		currentPage: wordpressPage(id: {eq: $id}) {
			...Page
			acf {
				hero: hashtagHero {
					image {
						localFile {
							childImageSharp {
								sizes(maxWidth: 1600) {
									base64
									aspectRatio
									src
									srcSet
									sizes
									originalImg
								}
							}
						}
					}
					title
					link {
						title
						url
					}
				}
				steps: hashtagSteps {
					steps {
						image {
							localFile {
								childImageSharp {
									sizes(maxWidth: 268) {
										base64
										aspectRatio
										src
										srcSet
										sizes
										originalImg
									}
								}
							}
						}
						title
						tag
					}
				}
				image1: hashtagImage {
					image {
						localFile {
							childImageSharp {
								sizes(maxWidth: 1600) {
									base64
									aspectRatio
									src
									srcSet
									sizes
									originalImg
								}
							}
						}
					}
				}
				image2: hashtagImage2 {
					image {
						localFile {
							childImageSharp {
								sizes(maxWidth: 1600) {
									base64
									aspectRatio
									src
									srcSet
									sizes
									originalImg
								}
							}
						}
					}
				}
				features: hashtagFeatures {
					features {
						icon
						text
					}
				}
				cta: hashtagCta {
					link {
						title
						url
					}
				}
			}
		}
		site {
			...Site
		}
	}
`;
