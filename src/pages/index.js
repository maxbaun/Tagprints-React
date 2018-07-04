import React, {Component} from 'react';
import PropTypes from 'prop-types';
import graphql from 'graphql';
import Typist from 'react-typist';

import {innerHtml, replaceLinks} from '../utils/wordpressHelpers';
import {setDataTheme} from '../utils/documentHelpers';
import HeroVid from '../images/homeHeroVid.mp4';
import HeroVidWebm from '../images/homeHeroVid.webm';
import Divider from '../images/brand-divider.png';
import Letters1 from '../images/letters.png';
import Letters2 from '../images/letters2.png';
import CSS from '../css/modules/home.module.scss';
import Fragment from '../components/fragment';
import Seo from '../components/seo';
import Link from '../components/link';
import Image from '../components/image';
import NewsletterSignup from '../components/newsletterSignup';

export default class Index extends Component {
	constructor(props) {
		super(props);

		this.state = {
			heroLoaded: false
		};

		this.heroVideo = null;

		this.handleVideoLoad = this.handleVideoLoad.bind(this);
	}

	static propTypes = {
		data: PropTypes.object.isRequired,
		location: PropTypes.object.isRequired,
		site: PropTypes.object.isRequired
	};

	componentDidMount() {
		setDataTheme('home');

		if (this.heroVideo) {
			this.heroVideo.addEventListener('loadedmetadata', this.handleVideoLoad);
		}

		setTimeout(this.handleVideoLoad, 500);
	}

	componentWillUnmount() {
		setDataTheme('default');

		if (this.heroVideo) {
			this.heroVideo.removeEventListener('loadedmetadata', this.handleVideoLoad);
		}
	}

	handleVideoLoad() {
		this.setState({
			heroLoaded: true
		});
	}

	render() {
		const {currentPage} = this.props.data;
		const {heroLoaded} = this.state;

		if (!currentPage) {
			return null;
		}

		const {hero, caseStudiesSection: csSection, clients, cta, differenceSection, serviceSection, tagSection, teamSection} = currentPage.acf;

		const heroCss = [CSS.hero];

		if (heroLoaded) {
			heroCss.push(CSS.heroLoaded);
		}

		return (
			<Fragment>
				<Seo currentPage={currentPage} site={this.props.site} location={this.props.location}/>
				<main className="main" role="main">
					<div className={CSS.home}>
						<div className={heroCss.join(' ')}>
							<div className={CSS.heroVideo}>
								<video autoPlay loop muted playsInline onLoadedData={this.handleVideoLoad}>
									<source src={HeroVid} type="video/mp4"/>
									<source src={HeroVidWebm} type="video/webm"/>
								</video>
							</div>
							<div className={CSS.heroOverlay}>
								<div className={CSS.heroOverlayInner}>
									<h1>
										{heroLoaded ? (
											<Typist
												startDelay={300}
												cursor={{
													show: false
												}}
											>
												{hero.title}
											</Typist>
										) : null}
									</h1>
								</div>
							</div>
						</div>
						<div className={CSS.cta}>
							<div className="container">
								<div className={CSS.ctaInner}>
									<Link
										className="btn btn-brand-cta"
										to={replaceLinks(cta.link.url)}
										style={{
											fontSize: 20,
											lineHeight: '24px',
											width: 350,
											maxWidth: '100%',
											margin: '0 auto',
											whiteSpace: 'normal'
										}}
									>
										{cta.link.title}
									</Link>
									<small className={CSS.ctaTag}>{cta.tag}</small>
								</div>
							</div>
						</div>
						<div className={CSS.clients}>
							<div className={CSS.clientsBg}>
								<Image
									sizes={clients.backgroundImage.localFile.childImageSharp.sizes}
									imgStyle={{
										height: '100%'
									}}
								/>
							</div>
							<div className={CSS.clientsImage}>
								<Image sizes={clients.image.localFile.childImageSharp.sizes}/>
							</div>
						</div>
						<div className={CSS.tagSection}>
							<div className="container">
								<div className={CSS.tagSectionInner}>
									{/* eslint-disable-next-line react/no-danger */}
									<h3 dangerouslySetInnerHTML={innerHtml(tagSection.title)} className={CSS.tagSectionHeader}/>
									{this.renderDivider(262, 30)}
									{/* eslint-disable-next-line react/no-danger */}
									<div dangerouslySetInnerHTML={innerHtml(tagSection.text)} className={CSS.tagSectionBody}/>
								</div>
							</div>
						</div>
						<div className={CSS.diffSection}>
							<div className="container">
								<div className={CSS.diffSectionInner}>
									<div className={CSS.diffSectionImage}>
										<div className={CSS.diffSectionImageInner}>
											<Image
												sizes={differenceSection.image.localFile.childImageSharp.sizes}
												imgStyle={{
													height: '100%',
													width: 'auto',
													maxWidth: 'none',
													objectPosition: 'right center',
													left: 'auto',
													top: '-8%'
												}}
											/>
										</div>
									</div>
									<div className={CSS.diffSectionContent}>
										{/* eslint-disable-next-line react/no-danger */}
										<div dangerouslySetInnerHTML={innerHtml(differenceSection.title)} className={CSS.diffSectionHeader}/>
										<ul className={CSS.diffs}>
											{differenceSection.differences &&
												differenceSection.differences.map(diff => {
													return (
														<li key={diff.title}>
															<div className={CSS.diff}>
																<div className={CSS.diffIcon}>
																	<span className={`icomoon icomoon-${diff.icon}`}/>
																</div>
																<div className={CSS.diffContent}>
																	<h5>{diff.title}</h5>
																	<p>{diff.text}</p>
																</div>
															</div>
														</li>
													);
												})}
										</ul>
									</div>
								</div>
							</div>
						</div>
						<div className={CSS.serviceSection}>
							<div className="container">
								{/* eslint-disable-next-line react/no-danger */}
								<div dangerouslySetInnerHTML={innerHtml(serviceSection.title)} className={CSS.serviceSecitonHeader}/>
								<div className={CSS.featuredService}>
									<div className={CSS.featuredServiceImage}>
										<div>
											<Image
												sizes={serviceSection.featuredService.image.localFile.childImageSharp.sizes}
												imgStyle={{
													right: '-28%',
													height: '100%',
													width: 'auto',
													top: '7%',
													maxWidth: 'none'
												}}
											/>
										</div>
									</div>
									<div className={CSS.featuredServiceContent}>
										<div>
											<div className={CSS.featuredServiceLogo}>
												<Image sizes={serviceSection.featuredService.logo.localFile.childImageSharp.sizes}/>
											</div>
											<div
												// eslint-disable-next-line react/no-danger
												dangerouslySetInnerHTML={innerHtml(serviceSection.featuredService.text)}
												className={CSS.featuredServiceBody}
											/>
											<div className={CSS.serviceLink}>
												<Link to={replaceLinks(serviceSection.featuredService.link.url)}>
													{serviceSection.featuredService.link.title} +
												</Link>
											</div>
										</div>
									</div>
								</div>
								<div className={CSS.services}>
									<ul>
										{serviceSection.services &&
											serviceSection.services.map(service => {
												return (
													<li key={service.title}>
														<div className={CSS.service}>
															<div className={CSS.serviceImage}>
																<Image sizes={service.image.localFile.childImageSharp.sizes}/>
															</div>
															<div className={CSS.serviceContent}>
																<div className={CSS.serviceBody}>
																	{/* eslint-disable-next-line react/no-danger */}
																	<h5 dangerouslySetInnerHTML={innerHtml(service.title)}/>
																	<p>{service.text}</p>
																</div>
																<div className={CSS.serviceLink}>
																	<Link to={replaceLinks(service.link.url)}>{service.link.title} +</Link>
																</div>
															</div>
														</div>
													</li>
												);
											})}
									</ul>
								</div>
							</div>
						</div>
						<div className={CSS.sectionCs}>
							<div className="container">
								<div className={CSS.featuredCs}>
									<div className={CSS.featuredCsImage}>
										<div className={CSS.featuredCsImageInner}>
											<Image
												sizes={csSection.featuredCaseStudy.image.localFile.childImageSharp.sizes}
												imgStyle={{
													height: '100%'
												}}
											/>
										</div>
									</div>
									<div className={CSS.featuredCsContent}>
										<span>{csSection.featuredCaseStudy.client}</span>
										<h5>{csSection.featuredCaseStudy.title}</h5>
										<p>{csSection.featuredCaseStudy.text}</p>
										<Link
											className="btn btn-brand"
											to={replaceLinks(csSection.featuredCaseStudy.link.url)}
											style={{
												fontSize: 14,
												lineHeight: 1,
												padding: '18px 30px'
											}}
										>
											{csSection.featuredCaseStudy.link.title} +
										</Link>
									</div>
								</div>
							</div>
							<div className={CSS.otherCs}>
								<div className="container">
									<div className={CSS.otherCsInner}>
										<div className={CSS.caseStudies}>
											<ul>
												{csSection.caseStudies &&
													csSection.caseStudies.map(caseStudy => {
														return (
															<li key={caseStudy.title}>
																<Link className={CSS.caseStudy} to={replaceLinks(caseStudy.link.url)}>
																	<div className={CSS.caseStudyImage}>
																		<div className={CSS.caseStudyImageInner}>
																			<Image
																				sizes={caseStudy.image.localFile.childImageSharp.sizes}
																				imgStyle={{
																					height: '100%'
																				}}
																			/>
																		</div>
																	</div>
																	<div className={CSS.caseStudyContent}>
																		<h5>
																			{caseStudy.title} <span>+</span>
																		</h5>
																	</div>
																</Link>
															</li>
														);
													})}
											</ul>
										</div>
									</div>
									<div className={CSS.otherCsFooter}>
										{this.renderDivider('100%', 0)}
										<Link
											className="btn btn-brand-trans"
											to={replaceLinks(csSection.allLink.url)}
											style={{
												fontSize: 20,
												lineHeight: '24px',
												padding: '20px 40px',
												whiteSpace: 'normal'
											}}
										>
											{csSection.allLink.title}
										</Link>
									</div>
								</div>
							</div>
						</div>
						<div className={CSS.sectionMail}>
							<div className={CSS.sectionMailImage1}>
								<img src={Letters1}/>
							</div>
							<div className="container">
								<div className={CSS.sectionMailForm}>
									<NewsletterSignup text="Stay in the know." btnClass="btn btn-brand" loaderColor="#2f103a"/>
								</div>
							</div>
							<div className={CSS.sectionMailImage2}>
								<img src={Letters2}/>
							</div>
						</div>
						<div className={CSS.sectionTeam}>
							<div className={CSS.sectionTeamImages}>
								<div className={CSS.sectionTeamImageLeft}>
									<div className={CSS.sectionTeamImageInner}>
										<Image
											sizes={teamSection.leftImage.localFile.childImageSharp.sizes}
											imgStyle={{
												height: '100%'
											}}
										/>
									</div>
								</div>
								<div className={CSS.sectionTeamImageRight}>
									<div className={CSS.sectionTeamImageInner}>
										<div className={CSS.sectionTeamGradient}>
											<Image
												sizes={teamSection.rightImage.localFile.childImageSharp.sizes}
												imgStyle={{
													top: '6%',
													height: '100%'
												}}
											/>
										</div>
									</div>
								</div>
							</div>
							<div className={CSS.sectionTeamContent}>
								<div className={CSS.sectionTeamContentInner}>
									<Link
										className="btn btn-brand-trans"
										to={replaceLinks(teamSection.link.url)}
										style={{
											fontSize: 20,
											lineHeight: '24px',
											padding: '20px 40px',
											whiteSpace: 'normal'
										}}
									>
										{teamSection.link.title}
									</Link>
								</div>
							</div>
						</div>
					</div>
				</main>
			</Fragment>
		);
	}

	renderDivider(maxWidth, margin) {
		return (
			<img
				src={Divider}
				style={{
					maxWidth,
					margin: `${margin}px auto`
				}}
			/>
		);
	}
}

// eslint-disable-next-line no-unused-vars
import {Page} from '../utils/fragments';

export const pageQuery = graphql`
	query homePageQuery {
		currentPage: wordpressPage(title: {eq: "TagPrints Homepage"}) {
			...Page
			acf {
				hero: homeHero {
					title
				}
				cta: homeCta {
					link {
						url
						title
					}
					tag
				}
				clients: homeClients {
					backgroundImage {
						...LargeImage
					}
					image {
						...LargeImage
					}
				}
				tagSection: homeTagSection {
					title
					text
				}
				differenceSection: homeDifferenceSection {
					image {
						...LargeImage
					}
					title
					differences {
						icon
						title
						text
					}
				}
				serviceSection: homeServicesSection {
					title
					featuredService {
						image {
							...LargeImage
						}
						logo {
							...LargeImage
						}
						text
						link {
							title
							url
						}
					}
					services {
						image {
							...LargeImage
						}
						title
						text
						link {
							title
							url
						}
					}
				}
				caseStudiesSection: homeCaseStudiesSection {
					featuredCaseStudy {
						image {
							...LargeImage
						}
						client
						title
						text
						link {
							title
							url
						}
					}
					caseStudies {
						image {
							...LargeImage
						}
						title
						link {
							title
							url
						}
					}
					allLink {
						title
						url
					}
				}
				teamSection: homeTeamSection {
					leftImage {
						...LargeImage
					}
					rightImage {
						...LargeImage
					}
					link {
						title
						url
					}
				}
			}
		}
	}
`;
