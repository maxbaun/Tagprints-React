import React, {Component} from 'react';
import PropTypes from 'prop-types';
import graphql from 'graphql';
import Img from 'gatsby-image';
import Link from 'gatsby-link';

import {innerHtml, replaceLinks} from '../utils/wordpressHelpers';
import Seo from '../components/seo';
import CSS from '../css/modules/team.module.scss';

export default class TeamTemplate extends Component {
	constructor(props) {
		super(props);

		this.state = {
			heroLoaded: false
		};

		this.renderHero = this.renderHero.bind(this);
		this.renderContent = this.renderContent.bind(this);
		this.renderTeam = this.renderTeam.bind(this);
		this.renderCta = this.renderCta.bind(this);
		this.handleHeroLoad = this.handleHeroLoad.bind(this);
	}

	static propTypes = {
		data: PropTypes.object.isRequired,
		location: PropTypes.object.isRequired
	};

	handleHeroLoad() {
		this.setState({
			heroLoaded: true
		});
	}

	render() {
		const {currentPage, site} = this.props.data;

		return (
			<div>
				<Seo
					currentPage={currentPage}
					site={site}
					location={this.props.location}
				/>
				<main className="main" role="main">
					{this.renderHero()}
					{this.renderContent()}
					{this.renderTeam()}
					{this.renderCta()}
				</main>
				{/* <main
					dangerouslySetInnerHTML={innerHtml(currentPage.content)} // eslint-disable-line react/no-danger
					className="main"
					role="main"
				/> */}
			</div>
		);
	}

	renderHero() {
		const {currentPage} = this.props.data;

		const {heroLoaded} = this.state;

		const {hero} = currentPage.acf;

		let titleClass = [];

		if (heroLoaded) {
			titleClass = titleClass.concat([
				'animated',
				'bounceInUp',
				'loaded',
				CSS.loaded
			]);
		}

		return (
			<div className={heroLoaded ? CSS.heroLoaded : CSS.hero}>
				<div className={CSS.heroInner}>
					<div className={CSS.heroImage}>
						<Img
							sizes={hero.image.localFile.childImageSharp.sizes}
							onLoad={this.handleHeroLoad}
						/>
					</div>
					{heroLoaded ? (
						<div className={CSS.heroContent}>
							<h1 className={titleClass.join(' ')}>
								{hero.title}
							</h1>
						</div>
					) : null}
				</div>
			</div>
		);
	}

	renderContent() {
		const {content} = this.props.data.currentPage.acf;

		return (
			<div className={CSS.content}>
				<div className="container">
					{/* eslint-disable-next-line react/no-danger */}
					<div dangerouslySetInnerHTML={innerHtml(content)}/>
					<hr/>
				</div>
			</div>
		);
	}

	renderTeam() {
		const {teamMembers} = this.props.data.currentPage.acf;

		return (
			<div className={CSS.teamSection}>
				<div className="container">
					<div className="row">
						{teamMembers &&
							teamMembers.map(member => {
								return (
									<div
										key={member.name}
										className="col-xs-6 col-sm-4"
									>
										<div className={CSS.member}>
											<div className={CSS.memberImage}>
												<Img
													resolutions={
														member.image.localFile
															.childImageSharp
															.resolutions
													}
												/>
											</div>
											<span className={CSS.memberName}>
												{member.name}
											</span>
											<span className={CSS.memberJob}>
												{member.job}
											</span>
										</div>
									</div>
								);
							})}
					</div>
				</div>
			</div>
		);
	}

	renderCta() {
		const {cta} = this.props.data.currentPage.acf;

		return (
			<div className={CSS.ctaSection}>
				<div className="container">
					<h1>
						{cta.title}
						<Link
							to={replaceLinks(cta.link.url)}
							className="btn btn-cta-transparent btn-cta-transparent-inverse"
						>
							{cta.link.title}
						</Link>
					</h1>
				</div>
			</div>
		);
	}
}

export const pageQuery = graphql`
	query teamPageQuery($id: String!) {
		currentPage: wordpressPage(id: {eq: $id}) {
			...Page
			acf {
				hero: teamHero {
					image {
						localFile {
							childImageSharp {
								sizes(maxWidth: 1600) {
									base64
									aspectRatio
									src
									srcSet
									sizes
									originalImg
								}
							}
						}
					}
					title
				}
				content: teamContent
				teamMembers {
					image {
						localFile {
							childImageSharp {
								resolutions(width: 149) {
									base64
									aspectRatio
									src
									srcSet
									width
									height
								}
							}
						}
					}
					name
					job
				}
				cta: teamCta {
					title
					link {
						title
						url
					}
				}
			}
		}
		site {
			...Site
		}
	}
`;