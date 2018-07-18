import React, {Component} from 'react';
import PropTypes from 'prop-types';
import graphql from 'graphql';

import Fragment from '../components/fragment';
import Form from '../components/form';
import Seo from '../components/seo';
import CSS from '../css/modules/quotev2.module.scss';

export default class QuotePageV2Template extends Component {
	static propTypes = {
		data: PropTypes.object.isRequired,
		location: PropTypes.object.isRequired,
		site: PropTypes.object.isRequired
	};

	render() {
		const {currentPage} = this.props.data;

		const {title, form} = currentPage.acf;

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
							<div className={CSS.form}>
								<div className={CSS.quoteLeft}>
									<span className="fa fa-quote-left"/>
								</div>
								<Form location={this.props.location} formId={form.form} labelPlacement={form.labelPlacement} classname="contact"/>
								<div className={CSS.quoteRight}>
									<span className="fa fa-quote-right"/>
								</div>
							</div>
						</div>
					</div>
				</main>
			</Fragment>
		);
	}
}

import {LargeImage} from '../utils/fragments'; // eslint-disable-line no-unused-vars

export const pageQuery = graphql`
	query freeQuoteQuery($id: String!) {
		currentPage: wordpressPage(id: {eq: $id}) {
			...Page
			acf {
				title: freeQuotePageTitle
				form: freeQuoteForm {
					form
					labelPlacement: fieldLabel
				}
			}
		}
	}
`;
