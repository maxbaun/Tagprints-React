import React, {Component} from 'react';
import PropTypes from 'prop-types';
import graphql from 'graphql';
import Img from 'gatsby-image';
import Link from 'gatsby-link';

import {innerHtml, replaceLinks} from '../utils/wordpressHelpers';
import Seo from '../components/seo';
import Fragment from '../components/fragment';
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
		location: PropTypes.object.isRequired,
		site: PropTypes.object.isRequired
	};

	handleHeroLoad() {
		this.setState({
			heroLoaded: true
		});
	}

	render() {
		const {currentPage} = this.props.data;

		return (
			<Fragment>
				<Seo currentPage={currentPage} site={this.props.site} location={this.props.location}/>
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
			</Fragment>
		);
	}

	renderHero() {
		const {currentPage} = this.props.data;

		const {heroLoaded} = this.state;

		const {hero} = currentPage.acf;

		return (
			<div className={heroLoaded ? CSS.heroLoaded : CSS.hero}>
				<div className={CSS.heroInner}>
					<div className={CSS.heroImage}>
						<Img sizes={hero.image.localFile.childImageSharp.sizes} onLoad={this.handleHeroLoad}/>
					</div>
					<div className={CSS.heroContent}>
						<div className={[CSS.heroContentInner, heroLoaded ? CSS.loaded : ''].join(' ')}>
							<h1>{hero.title}</h1>
						</div>
					</div>
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
									<div key={member.name} className="col-sm-4 col-xs-6">
										<div className={CSS.member}>
											<div className={CSS.memberImage}>
												<Img
													style={{
														height: 216,
														width: 'auto'
													}}
													imgStyle={{
														height: '100%',
														width: 'auto',
														margin: '0 auto',
														left: 0,
														right: 0
													}}
													sizes={member.image.localFile.childImageSharp.sizes}
												/>
											</div>
											<span className={CSS.memberName}>{member.name}</span>
											<span className={CSS.memberJob}>{member.job}</span>
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
						<Link to={replaceLinks(cta.link.url)} className="btn btn-cta-transparent btn-cta-transparent-inverse">
							{cta.link.title}
						</Link>
					</h1>
				</div>
			</div>
		);
	}
}

import {LargeImage} from '../utils/fragments'; // eslint-disable-line no-unused-vars

export const pageQuery = graphql`
	query teamPageQuery($id: String!) {
		currentPage: wordpressPage(id: {eq: $id}) {
			...Page
			acf {
				hero: teamHero {
					title
					image {
						...LargeImage
					}
				}
				content: teamContent
				teamMembers {
					name
					job
					image {
						...LargeImage
					}
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
	}
`;
