import React, {Component} from 'react';
import PropTypes from 'prop-types';
import graphql from 'graphql';

import {innerHtml} from '../utils/wordpressHelpers';
import Image from '../components/image';
import Form from '../components/form';
import Seo from '../components/seo';
import CSS from '../css/modules/job.module.scss';

export default class ContactPageTemplate extends Component {
	static propTypes = {
		data: PropTypes.object.isRequired,
		location: PropTypes.object.isRequired
	};

	render() {
		const {currentPage, site} = this.props.data;

		const {info, form, locations} = currentPage.acf;

		return (
			<div>
				<Seo
					currentPage={currentPage}
					site={site}
					location={this.props.location}
				/>
				<main className="main" role="main">
					<div className={CSS.wrap}>contactpage</div>
				</main>
				{/* <main
					dangerouslySetInnerHTML={innerHtml(currentPage.content)} // eslint-disable-line react/no-danger
					className="main"
					role="main"
				/> */}
			</div>
		);
	}
}

export const pageQuery = graphql`
	query contactPageQuery($id: String!) {
		currentPage: wordpressPage(id: {eq: $id}) {
			...Page
			acf {
				info: contactInfo {
					phone
					email
				}
				form: contactForm {
					form
					image {
						localFile {
							childImageSharp {
								resolutions(width: 222) {
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
				}
				locations: contactLocations {
					title
					address
					lat
					lng
					directions
				}
			}
		}
		site {
			...Site
		}
	}
`;
