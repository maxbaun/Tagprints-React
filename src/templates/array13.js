import React, {Component} from 'react';
import PropTypes from 'prop-types';
import graphql from 'graphql';
import Link from 'gatsby-link';

import {
	innerHtml,
	replaceLinks,
	getLightboxImageObject
} from '../utils/wordpressHelpers';
import CSS from '../css/modules/array13.module.scss';
import ArrayLogo from '../images/array13Logo.svg';
import Fragment from '../components/fragment';
import Seo from '../components/seo';
import Hero from '../components/hero';
import SectionSlider from '../components/sectionSlider';
import SectionGallery from '../components/sectionGallery';
import IconBlocks from '../components/iconBlocks';
import SectionRental from '../components/sectionRental';
import SectionFaq from '../components/sectionFaq';
import SectionPorfolio from '../components/sectionPortfolio';

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

	render() {
		const {currentPage} = this.props.data;
		const {acf: data} = currentPage;

		let galleryImages = [];

		if (data.gallery.images && data.gallery.images.length) {
			galleryImages = data.gallery.images.map(image => {
				return {
					...getLightboxImageObject(image),
					id: image.url,
					key: image.url,
					preload: true
				};
			});
		}

		return (
			<Fragment>
				<Seo
					currentPage={currentPage}
					site={this.props.site}
					location={this.props.location}
				/>
				<main className="main" role="main">
					<Hero
						backgroundImage={currentPage.image.localFile.childImageSharp.sizes}
						heroClass="heroArray13"
						buttons={data.hero.buttons}
						scrollTo="#array13SectionSlider"
					>
						<div className={CSS.hero}>
							<div className="container">
								<img src={ArrayLogo} alt="Array 13 Logo"/>
								<div
									className={CSS.heroContent} // eslint-disable-next-line react/no-danger
									dangerouslySetInnerHTML={innerHtml(data.hero.content)}
								/>
							</div>
						</div>
					</Hero>
					<SectionSlider
						id="array13SectionSlider"
						socialTitle="GREAT SHARING CAPABILITIES"
						slides={data.slider.slides}
						images={[{image: data.slider.image}]}
						sectionClass="a13Section"
						title="Array13"
						subtitle="3D PANORAMIC CAMERA"
					/>
					{this.renderCta('/free-quote/', 'Request A Free Quote')}
					<section className={CSS.iconSection}>
						<div className="container">
							<div
								// eslint-disable-next-line react/no-danger
								dangerouslySetInnerHTML={innerHtml(data.iconSection.header)}
								className={CSS.iconSectionHeader}
							/>
							<div className={CSS.iconSectionBody}>
								<span
									className={[
										`icomoon icomoon-${data.iconSection.icon}`,
										CSS.iconSectionIcon
									].join(' ')}
								/>
								<div
									// eslint-disable-next-line react/no-danger
									dangerouslySetInnerHTML={innerHtml(data.iconSection.content)}
									className={CSS.iconSectionContent}
								/>
							</div>
						</div>
					</section>
					<SectionGallery
						classname="a13Section"
						btnClass="btn btn-array13"
						images={galleryImages}
						link={data.gallery.link}
					>
						<div
							// eslint-disable-next-line react/no-danger
							dangerouslySetInnerHTML={innerHtml(data.gallery.header)}
							className={CSS.gallerySectionHeader}
						/>
					</SectionGallery>
					<section className={CSS.freebiesSection}>
						<div className="container">
							<div
								// eslint-disable-next-line react/no-danger
								dangerouslySetInnerHTML={innerHtml(data.freebies.header)}
								className={CSS.freebiesSectionHeader}
							/>
							<IconBlocks
								classname="a13Freebies"
								blocks={data.freebies.blocks}
							/>
						</div>
					</section>
					{this.renderCta('/free-quote/', 'Request A Free Quote')}
					<SectionRental
						classname="a13Rental"
						btnClass="btn btn-array13"
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
						classname="a13Faqs"
						accordionClass="a13Accordion"
					/>
					{/*

					<SectionPorfolio classname="pbpSection" title={data.gallery.title} categories={data.gallery.categories} modalClass="pbpModal"/>
					<section className={CSS.bonusesSection}>
						<div className="container">
							<div className={CSS.bonusesHeader}>
								<h2>{data.bonuses.title}</h2>
								<h4>{data.bonuses.subtitle}</h4>
								<h6>{data.bonuses.note}</h6>
							</div>
							<IconBlocks classname="pbpBonuses" blocks={data.bonuses.blocks}/>
						</div>
					</section>
					{this.renderCta('/free-quote/', 'Request A Free Quote')}
					<section className={CSS.promisesSection}>
						<div className="container">
							<div className={CSS.promisesHeader}>
								<h2
									// eslint-disable-next-line react/no-danger
									dangerouslySetInnerHTML={innerHtml(data.promises.title)}
								/>
								<h4>{data.promises.subtitle}</h4>
							</div>
							<IconBlocks classname="pbpPromises" blocks={data.promises.blocks}/>
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
					<SectionFaq id="pbpFaqs" title="FAQS" faqs={data.faqs} classname="pbpFaqs" accordionClass="pbpAccordion"/> */}
				</main>
			</Fragment>
		);
	}

	renderCta(url, title) {
		return (
			<section className={CSS.sectionCta}>
				<div className={CSS.sectionCtaInner}>
					<Link className="btn btn-array13-cta" to={replaceLinks(url)}>
						{title}
					</Link>
				</div>
			</section>
		);
	}
}

import {Page, LargeImage} from '../utils/fragments'; // eslint-disable-line no-unused-vars

export const pageQuery = graphql`
	query array13PageQuery($id: String!) {
		currentPage: wordpressPage(id: {eq: $id}) {
			...Page
			acf {
				hero: a13Hero {
					content
					buttons {
						url
						text
						class
					}
				}
				slider: a13Slider {
					image {
						...LargeImage
					}
					slides {
						content
					}
				}
				iconSection: a13IconSection {
					header
					icon
					content
				}
				gallery: a13Gallery {
					header
					link {
						title
						url
					}
					images {
						...LargeImage
					}
				}
				freebies: a13Freebies {
					header
					blocks {
						icon
						title
						text
					}
				}
				rental: a13Rental {
					options {
						title
						text
					}
				}
				faqs: a13Faqs {
					header
					content
				}
			}
		}
	}
`;
