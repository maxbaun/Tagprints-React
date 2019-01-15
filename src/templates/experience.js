import React, {Component} from 'react';
import PropTypes from 'prop-types';
import graphql from 'graphql';

import Fragment from '../components/fragment';
import Seo from '../components/seo';
import ExperienceCarousel from '../components/experienceCarousel';
import ExperienceCards from '../components/experienceCards';
import ExperienceDescription from '../components/experienceDescription';
import ExperienceBlocks from '../components/experienceBlocks';
import ExperienceFacts from '../components/experienceFacts';
import ExperienceEnhancements from '../components/experienceEnhancements';
import SectionGallery from '../components/sectionGallery';
import AccordionGroup from '../components/accordionGroup';
import Link from '../components/link';
import CSS from '../css/modules/experience.module.scss';
import {getLightboxImageObject} from '../utils/wordpressHelpers';
import { innerHtml } from '../utils/componentHelpers';

export default class ThanksTemplate extends Component {
	static propTypes = {
		data: PropTypes.object.isRequired,
		location: PropTypes.object.isRequired,
		site: PropTypes.object.isRequired
	};

// 	componentDidMount() {
// 		if (window.gtag) {
// 			// eslint-disable-next-line camelcase
// 			window.gtag('event', 'conversion', {
// 				send_to: 'AW-997082626/5imUCOOG6mAQgoy52wM' // eslint-disable-line camelcase
// 			});
// 		}
// 	}

	render() {
		const {currentPage} = this.props.data;

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
					<section className={CSS.section}/>
					<section className={CSS.sectionCards}>
						<div className="container">
							<h2 className={CSS.experienceTitleCards} dangerouslySetInnerHTML={innerHtml(currentPage.acf.cards.sectionTitle)}/>
							<ExperienceCards cards={currentPage.acf.cards.cards}/>
						</div>
					</section>
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
					<section className={CSS.sectionEnhancements}>
						<div className={CSS.sectionLeft}/>
						<div className={CSS.sectionRight}>
							<div className="container">
								<h2 className={CSS.experienceTitleEnhancements}>{currentPage.acf.enhancements.title}</h2>
								<ExperienceEnhancements items={currentPage.acf.enhancements.enhancements}/>
							</div>
						</div>
					</section>
					<section className={CSS.sectionCtaCenter}>
						<div className="container">
							<Link to={currentPage.acf.cta.link.url} className="btn btn-experience-outline">
								{currentPage.acf.cta.link.title}
							</Link>
						</div>
					</section>
					<section className={CSS.sectionFaqs}>
						<div className="container">
							<h2 className={CSS.experienceTitleFaqs}>{currentPage.acf.faqs.title}</h2>
							<AccordionGroup id="ExperienceAccordion" items={currentPage.acf.faqs.faqs} classname="experienceAccordion"/>
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
				cards: experienceCards {
					sectionTitle
					cards {
						title
						link {
							url
						}
						image {
							...LargeImage
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
				enhancements: experienceEnhancements {
					title
					enhancements {
						icon
						title
						text
					}
				}
				faqs: experienceFaqs {
					title
					faqs {
						header
						content
					}
				}
			}
		}
	}
`;
