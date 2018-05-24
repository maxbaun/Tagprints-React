import React, {Component} from 'react';
import PropTypes from 'prop-types';
import graphql from 'graphql';
import {fromJS} from 'immutable';

import {innerHtml} from '../utils/wordpressHelpers';
import Seo from '../components/seo';
import WorkCategories from '../components/workCategories';
import CaseStudyItem from '../components/caseStudyItem';
import CSS from '../css/modules/caseStudies.module.scss';

export default class CaseStudiesTemplate extends Component {
	constructor(props) {
		super(props);

		this.state = {
			caseStudies: this.transformCases(props.data.caseStudies),
			categories: this.transformCategories(props.data.caseStudyCategories)
		};
	}

	static propTypes = {
		data: PropTypes.object.isRequired,
		location: PropTypes.object.isRequired,
		pathContext: PropTypes.object.isRequired
	};

	transformCases(caseStudyData) {
		return caseStudyData.edges.map(c => {
			const caseStudy = c.node;
			return {
				id: caseStudy.id,
				title: caseStudy.title,
				subtitle: caseStudy.acf.subtitle,
				logo: caseStudy.acf.logo,
				image: caseStudy.image,
				slug: caseStudy.slug
			};
		});
	}

	transformCategories(categoryData) {
		return categoryData.edges.map(c => {
			const category = c.node;

			return {
				name: category.name,
				slug: category.slug,
				id: category.id,
				link: `/our-work/case-studies/${category.slug}`
			};
		});
	}

	getActiveCategory() {
		const {pathContext} = this.props;

		if (!pathContext.caseStudyCategoryId) {
			return;
		}

		const catId = pathContext.caseStudyCategoryId;
		const activeCategory = this.state.categories.find(c => c.id === catId);

		return activeCategory;
	}

	render() {
		const {site} = this.props.data;
		const {caseStudies, categories} = this.state;
		const activeCategory = this.getActiveCategory();

		let currentPage = {
			title: 'Case Studies'
		};

		if (activeCategory) {
			currentPage.title = activeCategory.name + ' Case Studies';
		}

		return (
			<div>
				<Seo
					currentPage={currentPage}
					site={site}
					location={this.props.location}
				/>
				<main className="main" role="main">
					<div className="our-work-cases featured-case-studies">
						<div className="container">
							<WorkCategories
								activeCategory={
									activeCategory ? activeCategory.slug : null
								}
								categories={fromJS(categories)}
								allLink="/our-work/case-studies"
							/>
						</div>
						<div className="container">
							{caseStudies.length > 0 ?
								caseStudies.map(c => {
									return (
										<div
											key={c.id}
											className="col-lg-4 col-md-4 col-sm-4 col-xs-12"
										>
											<div className={CSS.caseStudy}>
												<CaseStudyItem
													id={c.id}
													title={c.title}
													subtitle={c.subtitle}
													image={c.image}
													logo={c.logo}
													slug={c.slug}
												/>
											</div>
										</div>
									);
								  }) :
								this.renderEmpty()}
						</div>
					</div>
				</main>
			</div>
		);
	}
}

export const pageQuery = graphql`
	query caseStudiesQuery($caseStudyCategoryId: Int) {
		caseStudies: allWordpressWpCaseStudy(
			filter: {case_study_category: {eq: $caseStudyCategoryId}}
		) {
			edges {
				node {
					id: wordpress_id
					title
					content
					slug
					image: featured_media {
						url: source_url
						mediaDetails: media_details {
							width
							height
						}
						localFile {
							childImageSharp {
								sizes(maxWidth: 360) {
									base64
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
					acf {
						logo
						subtitle
					}
				}
			}
		}
		caseStudyCategories: allWordpressWpCaseStudyCategory {
			edges {
				node {
					id: wordpress_id
					name
					slug
				}
			}
		}
		site {
			...Site
		}
	}
`;
