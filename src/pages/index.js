import React, {Component} from 'react';
import PropTypes from 'prop-types';
import graphql from 'graphql';

import {innerHtml} from '../utils/wordpressHelpers';
import Seo from '../components/seo';

export default class Index extends Component {
	static propTypes = {
		data: PropTypes.object.isRequired,
		location: PropTypes.object.isRequired
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
				<main
					dangerouslySetInnerHTML={innerHtml(currentPage.content)} // eslint-disable-line react/no-danger
					className="main"
					role="main"
				/>
			</div>
		);
	}
}

export const pageQuery = graphql`
query homePageQuery {
  currentPage: wordpressPage(title: {eq: "TagPrints Homepage"}) {
	...Page
  }
  site {
	...Site
  }
}
`;
