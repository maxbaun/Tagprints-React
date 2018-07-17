import React, {Component} from 'react';
import PropTypes from 'prop-types';
import graphql from 'graphql';

import Fragment from '../components/fragment';
import Seo from '../components/seo';
import CSS from '../css/modules/thanks.module.scss';
import {setDataTheme} from '../utils/documentHelpers';
import {innerHtml} from '../utils/wordpressHelpers';

export default class ThanksTemplate extends Component {
	static propTypes = {
		data: PropTypes.object.isRequired,
		location: PropTypes.object.isRequired,
		site: PropTypes.object.isRequired
	};

	componentDidMount() {
		setDataTheme('contact');
		// eslint-disable-next-line camelcase
		window.gtag('event', 'conversion', {send_to: 'AW-997082626/5imUCOOG6mAQgoy52wM'});
	}

	componentWillUnmount() {
		setDataTheme('default');
	}

	render() {
		const {currentPage} = this.props.data;

		const {content} = currentPage;
		const {title} = currentPage.acf;

		return (
			<Fragment>
				<Seo currentPage={currentPage} site={this.props.site} location={this.props.location}/>
				<main className="main" role="main">
					<div className={CSS.wrap}>
						<div className={CSS.banner}>
							<div className={CSS.bannerInner}>
								<h1>{title}</h1>
							</div>
						</div>
						<div className="container">
							{/* eslint-disable-next-line react/no-danger */}
							<div className={CSS.content} dangerouslySetInnerHTML={innerHtml(content)}/>
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
			}
		}
	}
`;
