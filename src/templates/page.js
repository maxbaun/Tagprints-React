import React, {Component} from 'react';
import PropTypes from 'prop-types';
import graphql from 'graphql';

import {innerHtml} from '../utils/wordpressHelpers';
import {initPageElements} from '../utils/documentHelpers';
import Fragment from '../components/fragment';
import Seo from '../components/seo';

export default class PageTemplate extends Component {
	static propTypes = {
		data: PropTypes.object.isRequired,
		location: PropTypes.object.isRequired
	};

	componentDidMount() {
		initPageElements();
	}

	render() {
		const {currentPage, site} = this.props.data;

		return (
			<Fragment>
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
			</Fragment>
		);
	}
}

export const pageQuery = graphql`
	query defaultPageQuery($id: String!) {
		currentPage: wordpressPage(id: {eq: $id}) {
			...Page
			image: featured_media {
				localFile {
					childImageSharp {
						full: sizes(maxWidth: 1600) {
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
		}
		site {
			...Site
		}
	}
`;
