import React, {Component} from 'react';
import PropTypes from 'prop-types';
import graphql from 'graphql';

import Fragment from '../components/fragment';
import Seo from '../components/seo';
import CaseStudyItem from '../components/caseStudyItem';
import CSS from '../css/modules/thanks.module.scss';
import {innerHtml} from '../utils/wordpressHelpers';

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

	transformCases(caseStudyData) {
		if (!caseStudyData || !caseStudyData.edges) {
			return [];
		}

		return caseStudyData.edges
			.map(c => {
				const caseStudy = c.node;
				return {
					id: caseStudy.id,
					title: caseStudy.title,
					subtitle: caseStudy.acf.subtitle,
					logo: caseStudy.acf.logo,
					image: caseStudy.thumbnail,
					slug: caseStudy.slug,
					order: caseStudy.menu_order
				};
			})
			.sort((a, b) => {
				return a.order - b.order;
			})
			.slice(0, 3);
	}

	render() {
		const {currentPage, caseStudies} = this.props.data;

		const {content} = currentPage;
		const {title} = currentPage.acf;

		const cases = this.transformCases(caseStudies);

		return (
			<Fragment>
				<Seo
					currentPage={currentPage}
					site={this.props.site}
					location={this.props.location}
				/>
				<main className="main" role="main">
					<div className={CSS.wrap}>
						<div className={CSS.banner}>
							<div className={CSS.bannerInner}>
								<h1>{title}</h1>
							</div>
						</div>
						<div className="container">
							<div
								className={CSS.content}
								// eslint-disable-next-line react/no-danger
								dangerouslySetInnerHTML={innerHtml(content)}
							/>
							<h3 className={CSS.featuredTitle}>
								{currentPage.acf.featuredTitle}
							</h3>
							<div className="row">
								{cases.map(caseStudy => {
									return (
										<div
											key={caseStudy.id}
											className="col-lg-4 col-md-4 col-sm-4 col-xs-12"
										>
											<CaseStudyItem
												id={caseStudy.id}
												title={caseStudy.title}
												subtitle={caseStudy.subtitle}
												image={caseStudy.image}
												logo={caseStudy.logo}
												slug={caseStudy.slug}
												theme="contact"
											/>
										</div>
									);
								})}
							</div>
						</div>
					</div>
				</main>
			</Fragment>
		);
	}
}

import {Page} from '../utils/fragments'; // eslint-disable-line no-unused-vars

export const pageQuery = graphql`
	query thanksPageQuery($id: String!) {
		currentPage: wordpressPage(id: {eq: $id}) {
			...Page
			acf {
				title: thanksPageTitle
				featuredTitle: thanksFeaturedContentTitle
			}
		}
		caseStudies: allWordpressWpCaseStudy {
			edges {
				node {
					...CaseStudy
				}
			}
		}
	}
`;
