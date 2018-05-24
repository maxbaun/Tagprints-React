import React, {Component} from 'react';
import PropTypes from 'prop-types';
import graphql from 'graphql';

import {innerHtml} from '../utils/wordpressHelpers';
import Seo from '../components/seo';

export default class CaseStudyTemplate extends Component {
	static propTypes = {
		data: PropTypes.object.isRequired,
		location: PropTypes.object.isRequired
	};

	render() {
		const {caseStudy, site} = this.props.data;

		return (
			<div>
				<Seo
					currentPage={caseStudy}
					site={site}
					location={this.props.location}
				/>
				<main
					dangerouslySetInnerHTML={innerHtml(caseStudy.content)} // eslint-disable-line react/no-danger
					className="main"
					role="main"
				/>
			</div>
		);
	}
}

export const pageQuery = graphql`
	query caseStudyQuery($id: String!) {
		caseStudy: wordpressWpCaseStudy(id: {eq: $id}) {
			title
			content
			yoast {
				...CaseStudyYoast
			}
		}
		site {
			...Site
		}
	}
`;
