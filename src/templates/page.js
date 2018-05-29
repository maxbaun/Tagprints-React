import React, {Component} from 'react';
import PropTypes from 'prop-types';
import graphql from 'graphql';

import {innerHtml} from '../utils/wordpressHelpers';
import Fragment from '../components/fragment';
import Seo from '../components/seo';

export default class PageTemplate extends Component {
	static propTypes = {
		data: PropTypes.object.isRequired,
		location: PropTypes.object.isRequired,
		site: PropTypes.object.isRequired
	};

	render() {
		const {currentPage} = this.props.data;

		return (
			<Fragment>
				<Seo
					currentPage={currentPage}
					site={this.props.site}
					location={this.props.location}
				/>
				<main
					dangerouslySetInnerHTML={innerHtml(currentPage.content)} // eslint-disable-line react/no-danger
					className="main"
					role="main"
				/>
			</Fragment>
		);
	}
}

import {Page} from '../utils/fragments'; // eslint-disable-line no-unused-vars

export const pageQuery = graphql`
	query defaultPageQuery($id: String!) {
		currentPage: wordpressPage(id: {eq: $id}) {
			...Page
		}
	}
`;
