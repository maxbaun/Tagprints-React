import React, {Component} from 'react';
import PropTypes from 'prop-types';
import graphql from 'graphql';

import {innerHtml, getLightboxImageObject} from '../utils/wordpressHelpers';
import {click} from '../utils/componentHelpers';
import Fragment from '../components/fragment';
import Seo from '../components/seo';
import Image from '../components/imagev2';
import ImageChanger from '../components/imageChanger';
import Form from '../components/form';
import SectionGallery from '../components/sectionGallery';
import IconBlocks from '../components/iconBlocks';
import Button from '../components/button';
import Logo from '../components/logo';
import WindowSize from '../components/windowSize';
import Modal from '../components/modal';
import ModalContent from '../components/modalContent';
import CSS from '../css/modules/landing.module.scss';

class LandingTemplate extends Component {
	constructor(props) {
		super(props);

		this.state = {
			modalOpen: false
		};

		this.renderCta = this.renderCta.bind(this);
		this.getModClass = this.getModClass.bind(this);
		this.isMobile = this.isMobile.bind(this);
		this.handleModalToggle = ::this.handleModalToggle;
	}

	static propTypes = {
		data: PropTypes.object.isRequired,
		location: PropTypes.object.isRequired,
		site: PropTypes.object.isRequired,
		windowWidth: PropTypes.number.isRequired
	};

	componentDidMount() {
		// eslint-disable-next-line camelcase
		window.gtag('event', 'conversion', {send_to: 'AW-997082626/5imUCOOG6mAQgoy52wM'});
	}

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

	handleModalToggle(modalOpen) {
		this.setState({modalOpen});
	}

	render() {
		const {currentPage} = this.props.data;
		const {modalOpen} = this.state;
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
				<Modal showClose size="small" active={modalOpen} onClose={click(this.handleModalToggle, false)}>
					<ModalContent classname={this.getModClass('landing')}>
						<div className={CSS.modalInner}>
							<Form
								showCaptcha={false}
								location={this.props.location}
								formId={hero.form.formId}
								classname={this.getModClass('landing')}
							/>
						</div>
					</ModalContent>
				</Modal>
				<div className={wrapCss.join(' ')}>
					<div className={CSS.hero} style={heroStyle}>
						{hero.backgroundImage && hero.backgroundImage.url && pageTheme === 'dark' && !this.isMobile() ? (
							<div className={CSS.heroBackgroungImage}>
								<Image image={hero.backgroundImage} imgStyle={{height: '100%'}} style={{height: '100%'}}/>
							</div>
						) : null}
						<div className={CSS.heroInner}>
							<div className={CSS.header}>
								<div className={CSS.headerLogo}>
									<Logo width={153} height={29.8} classname={this.getModClass('landingHeader', true)}/>
								</div>
								<div className={CSS.headerPhone}>312-767-4990</div>
							</div>

							{/* eslint-disable-next-line react/no-danger */}
							<div dangerouslySetInnerHTML={innerHtml(hero.header)} className={CSS.heroHeader}/>
							<div className={CSS.heroContent}>
								<div className={CSS.heroImages}>
									<ImageChanger images={hero.images} imgStyle={{height: '100%', width: 'auto', margin: '0 auto', right: 0}}/>
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
						<Button classes={CSS.ctaBtn} onClick={click(this.handleModalToggle, true)}>
							{cta.link.title}
						</Button>
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
