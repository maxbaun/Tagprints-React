import React, {Component} from 'react';
import PropTypes from 'prop-types';
import graphql from 'graphql';

import Fragment from '../components/fragment';
import Seo from '../components/seo';
import ExperienceCarousel from '../components/experienceCarousel';
import ExperienceDescription from '../components/experienceDescription';
import ExperienceBlocks from '../components/experienceBlocks';
import ExperienceFacts from '../components/experienceFacts';
import SectionGallery from '../components/sectionGallery';
import Link from '../components/link';
import CSS from '../css/modules/experience.module.scss';
import {innerHtml, getLightboxImageObject} from '../utils/wordpressHelpers';

export default class ThanksTemplate extends Component {
	static propTypes = {
		data: PropTypes.object.isRequired,
		location: PropTypes.object.isRequired,
		site: PropTypes.object.isRequired
	};

	componentDidMount() {
		if (window.gtag) {
			// eslint-disable-next-line camelcase
			window.gtag('event', 'conversion', {
				send_to: 'AW-997082626/5imUCOOG6mAQgoy52wM' // eslint-disable-line camelcase
			});
		}
	}

	render() {
		const {currentPage} = this.props.data;

		console.log(currentPage.acf);

		const galleryImages = currentPage.acf.portfolio.images.map(image => {
			return {
				...getLightboxImageObject(image),
				id: image.url,
				key: image.url,
				preload: true
			};
		});

		return (
			<Fragment>
				<Seo currentPage={currentPage} site={this.props.site} location={this.props.location}/>
				<main className="main" role="main">
					<ExperienceCarousel scrollTo="#sectionProcess" slides={currentPage.acf.carousel.slides}/>
					<section className={CSS.section}>
						<div className="container">
							<ExperienceDescription content={currentPage.acf.description}/>
						</div>
					</section>
					<section id="sectionProcess" className={CSS.sectionProcess}>
						<div className="container">
							<h2 className={CSS.experienceTitleProcess}>{currentPage.acf.process.title}</h2>
							<ExperienceBlocks blocks={currentPage.acf.process.blocks}/>
						</div>
					</section>
					<section className={CSS.sectionCta}>
						<div className="container">
							<Link to={currentPage.acf.cta.link.url} className="btn btn-experience-white">
								{currentPage.acf.cta.link.title}
							</Link>
						</div>
					</section>
					<section className={CSS.sectionPortfolio}>
						<SectionGallery classname="experienceGallery" images={galleryImages} link={currentPage.acf.portfolio.link}>
							<div className="container">
								<h2 className={CSS.experienceTitlePortfolio}>{currentPage.acf.portfolio.title}</h2>
							</div>
						</SectionGallery>
					</section>
					<section className={CSS.sectionFacts}>
						<div className="container">
							<h2 className={CSS.experienceTitleFacts}>{currentPage.acf.facts.title}</h2>
							<ExperienceFacts yes={currentPage.acf.facts.do} no={currentPage.acf.facts.dont}/>
						</div>
					</section>
				</main>
			</Fragment>
		);
	}
}

import {Page} from '../utils/fragments'; // eslint-disable-line no-unused-vars

export const experiencePageQuery = graphql`
	query experiencePageQuery($id: String!) {
		currentPage: wordpressPage(id: {eq: $id}) {
			...Page
			acf {
				carousel: experienceCarousel {
					slides {
						image {
							...LargeImage
						}
						content
						links {
							link {
								title
								url
							}
						}
					}
				}
				description: experienceDescription
				process: experienceProcess {
					title
					blocks {
						icon {
							...LargeImage
						}
						title
						text
					}
				}
				cta: experienceCta {
					link {
						title
						url
					}
				}
				portfolio: experiencePortfolio {
					title
					images {
						...LargeImage
					}
					link {
						url
					}
				}
				facts: experienceFacts {
					title
					do {
						item
					}
					dont {
						item
					}
				}
			}
		}
	}
`;
