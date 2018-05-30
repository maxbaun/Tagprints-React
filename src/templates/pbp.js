import React, {Component} from 'react';
import PropTypes from 'prop-types';
import graphql from 'graphql';
import Link from 'gatsby-link';

import {
	innerHtml,
	replaceLinks,
	getLightboxImageObject
} from '../utils/wordpressHelpers';
import {setDataTheme} from '../utils/documentHelpers';
import CSS from '../css/modules/pbp.module.scss';
import Fragment from '../components/fragment';
import Seo from '../components/seo';
import Hero from '../components/hero';
import SectionSlider from '../components/sectionSlider';
import IconBlocks from '../components/iconBlocks';
import SectionRental from '../components/sectionRental';
import SectionFaq from '../components/sectionFaq';

export default class PbpPageTemplate extends Component {
	constructor(props) {
		super(props);

		this.renderCta = this.renderCta.bind(this);
	}

	static propTypes = {
		data: PropTypes.object.isRequired,
		location: PropTypes.object.isRequired,
		site: PropTypes.object.isRequired
	};

	componentDidMount() {
		setDataTheme('photobooth-pro');
	}

	componentWillUnmount() {
		setDataTheme('default');
	}

	render() {
		const {currentPage} = this.props.data;
		const {acf: data} = currentPage;

		// Const galleryImages = data.galleryImages.map(image => {
		// 	return {
		// 		...getLightboxImageObject(image),
		// 		id: image.url,
		// 		key: image.url,
		// 		preload: true
		// 	};
		// });

		return (
			<Fragment>
				<Seo
					currentPage={currentPage}
					site={this.props.site}
					location={this.props.location}
				/>
				<main className="main" role="main">
					<Hero
						backgroundImage={
							currentPage.image.localFile.childImageSharp.sizes
						}
						heroClass="heroPbp"
						buttons={data.hero.buttons}
						scrollTo="#pbpSectionSlider"
					>
						<div
							className={CSS.hero} // eslint-disable-next-line react/no-danger
							dangerouslySetInnerHTML={innerHtml(
								data.hero.content
							)}
						/>
					</Hero>
					<SectionSlider
						id="pbpSectionSlider"
						socialTitle="GREAT SHARING CAPABILITIES"
						slides={data.slider.slides}
						images={[data.slider.image]}
						sectionClass="pbpSection"
						title="Social <br/>Photobooth"
						tag="Pro"
					/>
					{this.renderCta('/free-quote/', 'Request A Free Quote')}
					{/* TODO - section gallery portfolio */}
					<section className={CSS.bonusesSection}>
						<div className="container">
							<div className={CSS.bonusesHeader}>
								<h2>{data.bonuses.title}</h2>
								<h4>{data.bonuses.subtitle}</h4>
								<h6>{data.bonuses.note}</h6>
							</div>
							<IconBlocks
								classname="pbpBonuses"
								blocks={data.bonuses.blocks}
							/>
						</div>
					</section>
					{this.renderCta('/free-quote/', 'Request A Free Quote')}
					{console.log(data.promises)}
					<section className={CSS.promisesSection}>
						<div className="container">
							<div className={CSS.promisesHeader}>
								<h2
									// eslint-disable-next-line react/no-danger
									dangerouslySetInnerHTML={innerHtml(
										data.promises.title
									)}
								/>
								<h4>{data.promises.subtitle}</h4>
							</div>
							<IconBlocks
								classname="pbpPromises"
								blocks={data.promises.blocks}
							/>
						</div>
					</section>
					<SectionRental
						classname="pbpRental"
						btnClass="btn btn-pbp-cta-accent"
						title="Rental Options"
						cta={{
							url: '/free-quote',
							title: 'Request A Free Quote'
						}}
						options={data.rental.options}
					/>
					<SectionFaq
						id="pbpFaqs"
						title="FAQS"
						faqs={data.faqs}
						classname="pbpFaqs"
						accordionClass="pbpAccordion"
					/>
				</main>
			</Fragment>
		);

		return (
			<Fragment>
				<Seo
					currentPage={currentPage}
					site={this.props.site}
					location={this.props.location}
				/>
				<main className="main" role="main">
					<Hero
						backgroundImage={
							currentPage.image.localFile.childImageSharp.sizes
						}
						heroClass="heroPbp"
						buttons={data.heroButtons}
						scrollTo="#pbpSectionSlider"
					>
						<div className={CSS.hero}>
							<h1>{data.heroTitle}</h1>
						</div>
					</Hero>
					<SectionSlider
						id="pbpSectionSlider"
						socialTitle="GREAT SHARING CAPABILITIES"
						slides={data.sliderSlides}
						images={[data.sliderImages[0].image]}
						sectionClass="pblSection"
					>
						<div className={CSS.sliderTitle}>
							<h1
								// eslint-disable-next-line react/no-danger
								dangerouslySetInnerHTML={innerHtml(
									data.sliderTitle
								)}
							/>
							<span className={CSS.tag}>{data.sliderTag}</span>
						</div>
					</SectionSlider>
					{this.renderCta(data.cta.url, data.cta.title)}
					<SectionGallery
						title={data.galleryTitle}
						subtitle={data.gallerySubtitle}
						images={galleryImages}
						link={data.galleryLink}
					>
						<div className={CSS.gallerySectionTitle}>
							<div className="container">
								<h3>{data.galleryTitle}</h3>
								<h5>{data.gallerySubtitle}</h5>
							</div>
						</div>
					</SectionGallery>
					<div className={CSS.perksSection}>
						<div className={CSS.perksSectionTitle}>
							<h3>{data.perkTitle}</h3>
							<h5>{data.perkSubtitle}</h5>
						</div>
						<IconBlocks
							classname="pblPerks"
							blocks={data.perkBlocks}
						/>
					</div>
					{this.renderCta(data.cta.url, data.cta.title)}
					<div className={CSS.factsSection}>
						<div className={CSS.factsSectionTitle}>
							<h3
								// eslint-disable-next-line react/no-danger
								dangerouslySetInnerHTML={innerHtml(
									data.factsTitle
								)}
							/>
							<h5
								// eslint-disable-next-line react/no-danger
								dangerouslySetInnerHTML={innerHtml(
									data.factsSubtitle
								)}
							/>
						</div>
						<IconBlocks
							classname="pblFacts"
							blocks={data.factsBlocks}
						/>
					</div>
					<SectionRental
						classname="pblRental"
						btnClass="btn btn-pbl-cta"
						title="Rental Options"
						cta={data.rentalCta}
						options={data.rentalBlocks}
					/>
					<SectionFaq
						id="pblFaqs"
						title={data.faqTitle}
						faqs={data.faqFaqs}
						classname="pblFaq"
						accordionClass="pblAccordion"
					/>
				</main>
				{/* <main
					dangerouslySetInnerHTML={innerHtml(currentPage.content)} // eslint-disable-line react/no-danger
					className="main"
					role="main"
				/> */}
			</Fragment>
		);
	}

	renderCta(url, title) {
		return (
			<section className={CSS.sectionCta}>
				<div className={CSS.sectionCtaInner}>
					<Link className="btn btn-pbp-cta" to={replaceLinks(url)}>
						{title}
					</Link>
				</div>
			</section>
		);
	}
}

import {Page, LargeImage} from '../utils/fragments'; // eslint-disable-line no-unused-vars

export const pageQuery = graphql`
	query pbpPageQuery($id: String!) {
		currentPage: wordpressPage(id: {eq: $id}) {
			...Page
			acf {
				hero: pbpHero {
					content
					buttons {
						url
						text
						class
					}
				}
				slider: pbpSlider {
					image {
						...LargeImage
					}
					slides {
						content
					}
				}
				gallery: pbpGallery {
					title
					categories {
						title
						featuredImage {
							...LargeImage
						}
						images {
							...LargeImage
						}
					}
				}
				bonuses: pbpBonuses {
					title
					subtitle
					note
					blocks {
						icon
						title
						text
					}
				}
				promises: pbpPromises {
					title
					subtitle
					blocks {
						icon
						title
						text
					}
				}
				rental: pbpRental {
					options {
						title
						text
					}
				}
				faqs: pbpFaqs {
					header
					content
				}
			}
		}
	}
`;
