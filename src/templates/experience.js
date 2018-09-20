import React, {Component} from 'react';
import PropTypes from 'prop-types';
import graphql from 'graphql';

import Fragment from '../components/fragment';
import Seo from '../components/seo';
import ExperienceCarousel from '../components/experienceCarousel';
import CSS from '../css/modules/experience.module.scss';
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

	render() {
		const {currentPage} = this.props.data;

		console.log(currentPage.acf);
		console.log(currentPage.acf.carousel.slides);

		return (
			<Fragment>
				<Seo currentPage={currentPage} site={this.props.site} location={this.props.location}/>
				<main className="main" role="main">
					<ExperienceCarousel slides={currentPage.acf.carousel.slides}/>
				</main>
			</Fragment>
		);
	}
}

import {Page} from '../utils/fragments'; // eslint-disable-line no-unused-vars

export const experiencePageQuery = graphql`
	query experiencePageQuery($id: String!) {
		currentPage: wordpressPage(id: {eq: $id}) {
			...Page
			acf {
				carousel: experienceCarousel {
					slides {
						image {
							...LargeImage
						}
						content
						links {
							link {
								title
								url
							}
						}
					}
				}
			}
		}
	}
`;
