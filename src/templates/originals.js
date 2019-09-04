import React, {Component} from 'react';
import PropTypes from 'prop-types';
import graphql from 'graphql';
import Link from 'gatsby-link';
import Youtube from 'react-youtube';

import {
	innerHtml,
	replaceLinks,
	getLightboxImageObject
} from '../utils/wordpressHelpers';
import CSS from '../css/modules/originals.module.scss';
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
import Modal from '../components/modal';
import ImageV2 from '../components/imagev2';
import OriginalsCarousel from '../components/originalsCarousel';

export default class PbpPageTemplate extends Component {
	constructor(props) {
		super(props);

		this.state = {
			modalOpen: false
		};

		this.handleModalClose = this.handleModalClose.bind(this);
		this.handleModalOpen = this.handleModalOpen.bind(this);
	}

	static propTypes = {
		data: PropTypes.object.isRequired,
		location: PropTypes.object.isRequired,
		site: PropTypes.object.isRequired
	};

	handleModalClose(e) {
		this.setState({
			modalOpen: false
		});
	}

	handleModalOpen() {
		this.setState({
			modalOpen: true
		});
	}

	render() {
		const {currentPage} = this.props.data;
		const {modalOpen} = this.state;
		const {acf: data} = currentPage;

		return (
			<Fragment>
				<Seo
					currentPage={currentPage}
					site={this.props.site}
					location={this.props.location}
				/>
				<main className="main" role="main">
					<Modal showClose active={modalOpen} onClose={this.handleModalClose} height={558} width={992}>
						{modalOpen ? (
							<Youtube
								videoId={data.hero.video}
								opts={{
									height: 558,
									width: 992,
									playerVars: {
										autoplay: 1,
										controls: 0,
										showinfo: 0
									}
								}}
							/>
						) : null}
					</Modal>
					<div className={CSS.hero}>
						<div className={CSS.heroBackground}>
							<div/>
						</div>
						<div className={CSS.heroInner}>
							<div className={CSS.heroImage}>
								<ImageV2
									image={data.hero.image}
									imgStyle={{
										height: '100%',
										width: 'auto'
									}}
								/>
							</div>
							<ImageV2
								className={CSS.heroLogoImage}
								image={data.hero.logoImage}
								imgStyle={{
									objectFit: 'initial',
									height: 'auto',
									width: 'calc(100% - 30px)',
									margin: '0 15px'
								}}
								style={{
									position: 'absolute',
									height: 'auto'
								}}
							/>
							<button type="button" className={CSS.heroPlay} onClick={this.handleModalOpen}>
								<span/>
								<span/>
								<i className="fa fa-play"/>
							</button>
						</div>
					</div>
					<section className={CSS.intro}>
						<div className="container">
							<div className={CSS.introInner}>
								<div dangerouslySetInnerHTML={innerHtml(data.intro)}/>
								<i className="fa fa-caret-down"/>
							</div>
						</div>
					</section>
					{data.sections.map(section => (
						<section key={section.promoContent} className={CSS.section}>
							<div className="container">
								<div className={CSS.sectionPromo} data-position={section.position}>
									<div className={CSS.sectionPromoContent} dangerouslySetInnerHTML={innerHtml(section.promoContent)}/>
									<div className={CSS.sectionPromoImage}>
										<OriginalsCarousel
											images={section.promoImages}
										/>
									</div>
								</div>
								<hr/>
								<div className={CSS.sectionProject}>
									<div className={CSS.sectionProjectLeft}>
										<div className={CSS.sectionProjectTag}>
											<div>
												<p>Project<br/>Feature</p>
												<i className="fa fa-chevron-right"/>
											</div>
										</div>
										<div className={CSS.sectionProjectImage}>
											<ImageV2 image={section.projectImage}/>
										</div>
									</div>
									<div className={CSS.sectionProjectContent}>
										<div dangerouslySetInnerHTML={innerHtml(section.projectContent)}/>
										<Link to={replaceLinks(section.projectLink.url)}>
											<span>{section.projectLink.title}</span>
											<i className="fa fa-long-arrow-right"/>
										</Link>
									</div>
								</div>
							</div>
						</section>
					))}
					<section className={CSS.faqs}>
						<div className="container">
							<header dangerouslySetInnerHTML={innerHtml(data.faqs.header)}/>
						</div>
						<SectionFaq id="pblFaqs" faqs={data.faqs.faqs} classname="pblFaq" accordionClass="pblAccordion"/>
					</section>
					<section className={CSS.sectionCta}>
						<div className={CSS.sectionCtaInner}>
							<Link className="btn btn-cta btn-cta-transparent-inverse" to="/free-quote">
								Free Quote
							</Link>
						</div>
					</section>
				</main>
			</Fragment>
		);
	}
}

import {Page, LargeImage} from '../utils/fragments'; // eslint-disable-line no-unused-vars

export const pageQuery = graphql`
	query origiginalsPageQuery($id: String!) {
		currentPage: wordpressPage(id: {eq: $id}) {
			...Page
			acf {
				hero: ogHero {
					logoImage {
						...LargeImage
					}
					image {
						...LargeImage
					}
					video
				}
				intro: ogIntro
				sections: ogSections {
					position
					promoImages {
						...LargeImage
					}
					promoContent
					projectImage {
						...LargeImage
					}
					projectContent
					projectLink {
						title
						url
					}
				}
				faqs: ogFaqs {
					header
					faqs {
						header
						content
					}
				}
			}
		}
	}
`;
