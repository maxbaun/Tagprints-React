import React, {Component} from 'react';
import PropTypes from 'prop-types';
import graphql from 'graphql';

import {innerHtml, getLightboxImageObject} from '../utils/wordpressHelpers';
import Fragment from '../components/fragment';
import Seo from '../components/seo';
import Image from '../components/imagev2';
import Form from '../components/form';
import SectionGallery from '../components/sectionGallery';
import IconBlocks from '../components/iconBlocks';
import Link from '../components/link';
import Logo from '../components/logo';
import WindowSize from '../components/windowSize';
import CSS from '../css/modules/landing.module.scss';

class LandingTemplate extends Component {
	constructor(props) {
		super(props);

		this.renderCta = this.renderCta.bind(this);
		this.getModClass = this.getModClass.bind(this);
		this.isMobile = this.isMobile.bind(this);
	}

	static propTypes = {
		data: PropTypes.object.isRequired,
		location: PropTypes.object.isRequired,
		site: PropTypes.object.isRequired,
		windowWidth: PropTypes.number.isRequired
	};

	getModClass(base, hasTheme = false) {
		const {pageClass, pageTheme} = this.props.data.currentPage.acf;
		let cl = base;

		if (pageClass && pageClass !== '') {
			cl += `--${pageClass}`;
		}

		if (hasTheme && pageTheme && pageTheme !== '') {
			cl += `--${pageTheme}`;
		}

		return cl;
	}

	isMobile() {
		return this.props.windowWidth <= 992;
	}

	render() {
		const {currentPage} = this.props.data;
		let {pageClass, pageTheme, hero, description, gallery, features, clients, facts} = currentPage.acf;

		const galleryImages = gallery.map(image => {
			return {
				...getLightboxImageObject(image),
				id: image.url,
				key: image.url,
				preload: true
			};
		});

		const heroStyle = {};

		if (hero.backgroundImage && hero.backgroundImage.url && pageTheme === 'dark' && this.isMobile()) {
			heroStyle.backgroundImage = `url(${hero.backgroundImage.url})`;
		}

		const wrapCss = [CSS.wrap, CSS[pageClass], CSS[pageTheme]];

		return (
			<Fragment>
				<Seo currentPage={currentPage} site={this.props.site} location={this.props.location}/>
				<div className={wrapCss.join(' ')}>
					<div className={CSS.hero} style={heroStyle}>
						{hero.backgroundImage && hero.backgroundImage.url && pageTheme === 'dark' && !this.isMobile() ? (
							<div className={CSS.heroBackgroungImage}>
								<Image image={hero.backgroundImage} imgStyle={{height: '100%'}} style={{height: '100%'}}/>
							</div>
						) : null}
						<div className={CSS.heroInner}>
							<div className={CSS.headerLogo}>
								<Logo width={153} height={29.8} classname={this.getModClass('landingHeader', true)}/>
							</div>
							{/* eslint-disable-next-line react/no-danger */}
							<div dangerouslySetInnerHTML={innerHtml(hero.header)} className={CSS.heroHeader}/>
							<div className={CSS.heroContent}>
								<div className={CSS.heroImages}>
									<Image image={hero.images[0]} imgStyle={{height: '100%', width: 'auto', margin: '0 auto'}}/>
								</div>
								<div className={CSS.heroForm}>
									<Form
										showCaptcha={false}
										location={this.props.location}
										formId={hero.form.formId}
										labelPlacement="hidden_label"
										classname={this.getModClass('landing')}
									/>
									<small className={CSS.formNote}>{hero.form.note}</small>
								</div>
							</div>
						</div>
					</div>
					<div className={CSS.description}>
						<div className="container">
							{/* eslint-disable-next-line react/no-danger */}
							<div dangerouslySetInnerHTML={innerHtml(description)}/>
						</div>
					</div>
					<div className={CSS.gallery}>
						<SectionGallery classname="landingSection" images={galleryImages} itemSpacing={0}/>
					</div>
					<div className={CSS.features}>
						{/* eslint-disable-next-line react/no-danger */}
						<div dangerouslySetInnerHTML={innerHtml(features.header)} className={CSS.featuresHeader}/>
						<ul className={CSS.featureList}>
							{features.features.map(f => {
								return (
									<li key={f.title}>
										<div className={CSS.feature}>
											<span className={`icomoon-${f.icon}`}/>
											<p>{f.title}</p>
										</div>
									</li>
								);
							})}
						</ul>
					</div>
					{this.renderCta()}
					<div className={CSS.clients}>
						<div className="container">
							{/* eslint-disable-next-line react/no-danger */}
							<div dangerouslySetInnerHTML={innerHtml(clients.header)} className={CSS.clientsHeader}/>
							<Image image={clients.image}/>
						</div>
					</div>
					<div className={CSS.facts}>
						{/* eslint-disable-next-line react/no-danger */}
						<div dangerouslySetInnerHTML={innerHtml(facts.header)} className={CSS.factsHeader}/>
						<IconBlocks classname={this.getModClass('landingBlocks')} blocks={facts.facts}/>
					</div>
					{this.renderCta()}
					<div className={CSS.footer}>
						<div className={CSS.footerLogo}>
							<Logo width={376} height={73} classname="landingFooter"/>
						</div>
					</div>
				</div>
			</Fragment>
		);
	}

	renderCta() {
		const {cta} = this.props.data.currentPage.acf;

		return (
			<div className={CSS.cta}>
				<div className="container">
					<div className={CSS.ctaInner}>
						<Link className={CSS.ctaBtn} to={cta.link.url}>
							{cta.link.title}
						</Link>
					</div>
				</div>
			</div>
		);
	}
}

export default WindowSize(LandingTemplate);

import {Page, LargeImage} from '../utils/fragments'; // eslint-disable-line no-unused-vars

export const landingTemplateQuery = graphql`
	query landingTemplateQuery($id: String!) {
		currentPage: wordpressPage(id: {eq: $id}) {
			...Page
			acf {
				pageClass: landingPageClass
				pageTheme: landingPageTheme
				hero: landingHero {
					header
					backgroundImage {
						...LargeImage
					}
					images {
						...LargeImage
					}
					form {
						formId
						note
					}
				}
				description: landingDescription
				gallery: landingGallery {
					...LargeImage
				}
				features: landingFeatures {
					header
					features {
						title
						icon
					}
				}
				cta: landingCta {
					link {
						title
						url
					}
				}
				clients: landingClients {
					header
					image {
						...LargeImage
					}
				}
				facts: landingFacts {
					header
					facts {
						icon
						title
						text
					}
				}
			}
		}
	}
`;
