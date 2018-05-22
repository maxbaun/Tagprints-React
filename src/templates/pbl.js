import React, {Component} from 'react';
import PropTypes from 'prop-types';
import graphql from 'graphql';
import Link from 'gatsby-link';
import {fromJS} from 'immutable';

import {innerHtml, replaceLinks} from '../utils/wordpressHelpers';
import CSS from '../css/modules/pbl.module.scss';
import Fragment from '../components/fragment';
import Seo from '../components/seo';
import Hero from '../components/hero';
import SectionSlider from '../components/sectionSlider';
import SectionGallery from '../components/sectionGallery';
import IconBlocks from '../components/iconBlocks';
import SectionRental from '../components/sectionRental';
import SectionFaq from '../components/sectionFaq';

export default class PblPageTemplate extends Component {
	constructor(props) {
		super(props);

		this.renderCta = this.renderCta.bind(this);
	}

	static propTypes = {
		data: PropTypes.object.isRequired,
		location: PropTypes.object.isRequired
	};

	render() {
		const {currentPage, site} = this.props.data;
		const {acf: data} = currentPage;

		const galleryImages = data.galleryImages.map(image => {
			return {
				id: image.id,
				key: image.id,
				preload: true,
				lightbox: 'pbl-gallery',
				url: image.url,
				thumbnail: image.url,
				height: image.mediaDetails.height,
				width: image.mediaDetails.width,
				sizes: image.sizes
			};
		});

		return (
			<Fragment>
				<Seo
					currentPage={currentPage}
					site={site}
					location={this.props.location}
				/>
				<main className="main" role="main">
					<Hero
						backgroundImage={
							currentPage.image.localFile.childImageSharp.full
						}
						heroClass="heroPbl"
						buttons={data.heroButtons}
						scrollTo="#pblSectionSlider"
					>
						<div className={CSS.hero}>
							<h1>{data.heroTitle}</h1>
						</div>
					</Hero>
					<SectionSlider
						id="pblSectionSlider"
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
						images={fromJS(galleryImages)}
						link={fromJS(data.galleryLink)}
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
					<Link className="btn btn-pbl-cta" to={replaceLinks(url)}>
						{title}
					</Link>
				</div>
			</section>
		);
	}
}

export const pageQuery = graphql`
	query pblPageQuery($id: String!) {
		currentPage: wordpressPage(id: {eq: $id}) {
			...Page
			image: featured_media {
				localFile {
					childImageSharp {
						full: sizes(maxWidth: 1600) {
							base64
							aspectRatio
							src
							srcSet
							srcWebp
							srcSetWebp
							sizes
							originalImg
							originalName
						}
					}
				}
			}
			acf {
				heroTitle: pblHeroTitle
				heroButtons: pblHeroButtons {
					url
					text
					class
				}
				sliderTitle: pblSectionSliderTitle
				sliderTag: pblSectionSliderTag
				sliderImages: pblSectionSliderImages {
					image {
						url: source_url
						mediaDetails: media_details {
							width
							height
						}
						localFile {
							childImageSharp {
								sizes(maxWidth: 200) {
									base64
									aspectRatio
									src
									srcSet
									srcWebp
									srcSetWebp
									sizes
									originalImg
									originalName
								}
							}
						}
					}
				}
				sliderSlides: pblSectionSliderSlides {
					content
				}
				galleryTitle: pblSectionGalleryTitle
				gallerySubtitle: pblSectionGallerySubtitle
				galleryLink: pblSectionGalleryLink {
					title
					url
				}
				galleryImages: pblSectionGalleryGallery {
					url: source_url
					id
					mediaDetails: media_details {
						width
						height
					}
					thumbnail: localFile {
						childImageSharp {
							sizes(maxWidth: 300) {
								base64
								tracedSVG
								aspectRatio
								src
								srcSet
								srcWebp
								srcSetWebp
								sizes
								originalImg
								originalName
							}
						}
					}
					full: localFile {
						childImageSharp {
							sizes {
								base64
								tracedSVG
								aspectRatio
								src
								srcSet
								srcWebp
								srcSetWebp
								sizes
								originalImg
								originalName
							}
						}
					}
				}
				cta: pblSectionCtaLink {
					title
					url
				}
				perkTitle: pblSectionPerksTitle
				perkSubtitle: pblSectionPerksSubtitle
				perkBlocks: pblSectionPerksBlocks {
					icon
					title
					text
				}
				factsTitle: pblSectionFactsTitle
				factsSubtitle: pblSectionFactsSubtitle
				factsBlocks: pblSectionFactsBlocks {
					icon
					title
					text
				}
				rentalTitle: pblSectionRentalTitle
				rentalCta: pblSectionRentalCta {
					title
					url
				}
				rentalBlocks: pblSectionRentalOptions {
					title
					accent
					text
				}
				faqTitle: pblSectionFaqTitle
				faqFaqs: pblSectionFaqFaqs {
					header
					content
				}
			}
		}
	}
`;
