import React, {Component} from 'react';
import PropTypes from 'prop-types';
import graphql from 'graphql';

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
		pathContext: PropTypes.object.isRequired,
		site: PropTypes.object.isRequired
	};

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
				<Seo currentPage={currentPage} site={this.props.site} location={this.props.location}/>
				<main className="main" role="main">
					<div className="our-work-cases featured-case-studies">
						<div className="container">
							<WorkCategories
								activeCategory={activeCategory ? activeCategory.slug : null}
								categories={categories}
								allLink="/our-work/case-studies"
							/>
						</div>
						<div className="container">
							{caseStudies.length > 0 ?
								caseStudies.map(c => {
									return (
										<div key={c.id} className="col-lg-4 col-md-4 col-sm-4 col-xs-12">
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
								null}
						</div>
					</div>
				</main>
			</div>
		);
	}
}

import {CaseStudy} from '../utils/fragments'; //eslint-disable-line

export const pageQuery = graphql`
	query caseStudiesQuery($caseStudyCategoryId: Int) {
		caseStudies: allWordpressWpCaseStudy(filter: {case_study_category: {eq: $caseStudyCategoryId}, acf: {hideFromListView: {ne: true}}}) {
			edges {
				node {
					...CaseStudy
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
	}
`;
