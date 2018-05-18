import React, {Component} from 'react';
import PropTypes from 'prop-types';
import graphql from 'graphql';
import Img from 'gatsby-image';

import Fragment from '../components/fragment';
import {innerHtml} from '../utils/wordpressHelpers';
import Image from '../components/image';
import Location from '../components/location';
import Form from '../components/form';
import Seo from '../components/seo';
import CSS from '../css/modules/contact.module.scss';
import {emailLink, phoneLink} from '../utils/componentHelpers';

export default class PblPageTemplate extends Component {
	static propTypes = {
		data: PropTypes.object.isRequired,
		location: PropTypes.object.isRequired
	};

	render() {
		const {currentPage, site} = this.props.data;

		return (
			<Fragment>
				<Seo
					currentPage={currentPage}
					site={site}
					location={this.props.location}
				/>
				<main className="main" role="main">
					pbl page content
				</main>
				{/* <main
					dangerouslySetInnerHTML={innerHtml(currentPage.content)} // eslint-disable-line react/no-danger
					className="main"
					role="main"
				/> */}
			</Fragment>
		);
	}
}

export const pageQuery = graphql`
	query pblPageQuery($id: String!) {
		currentPage: wordpressPage(id: {eq: $id}) {
			...Page
			acf {
				heroTitle: pblHeroTitle
				heroButtons: pblHeroButtons {
					url
					text
				}
				sliderTitle: pblSectionSliderTitle
				sliderTag: pblSectionSliderTag
				sliderImages: pblSectionSliderImages {
					image {
						url: source_url
						localFile {
							childImageSharp {
								sizes(maxWidth: 200) {
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
					thumbnail: localFile {
						childImageSharp {
							sizes(maxWidth: 200) {
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
