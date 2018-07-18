import React, {Component} from 'react';
import PropTypes from 'prop-types';
import graphql from 'graphql';

import Fragment from '../components/fragment';
import LocationSelector from '../components/locationSelector';
import Form from '../components/form';
import Seo from '../components/seo';
import CSS from '../css/modules/contactv2.module.scss';
import {emailLink, phoneLink} from '../utils/componentHelpers';

export default class ContactPageV2Template extends Component {
	static propTypes = {
		data: PropTypes.object.isRequired,
		location: PropTypes.object.isRequired,
		site: PropTypes.object.isRequired
	};

	render() {
		const {currentPage} = this.props.data;

		const {title, info, form, locations} = currentPage.acf;

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
							<div className={CSS.formContainer}>
								<div className={CSS.header}>
									<ul className={CSS.headerInfo}>
										<li>
											<a href={phoneLink(info.phone)}>
												<span className="fa fa-phone"/>
												<p>{info.phone}</p>
											</a>
										</li>
										<li>
											<a href={emailLink(info.email)}>
												<span className="fa fa-envelope"/>
												<p>{info.email}</p>
											</a>
										</li>
									</ul>
								</div>
								<hr className={CSS.seperator}/>
								<div className={CSS.form}>
									<Form
										location={this.props.location}
										formId={form.form}
										labelPlacement={form.labelPlacement}
										classname="contact"
									/>
								</div>
							</div>
						</div>
						<div className={CSS.formContainer}/>

						<div className={CSS.locationSection}>
							<LocationSelector locations={locations}/>
						</div>
					</div>
				</main>
				{/* <main
					dangerouslySetInnerHTML={innerHtml(currentPage.content)} // eslint-disable-line react/no-danger
					className="main"
					role="main"
				/> */}
			</Fragment>
		);
	}
}

import {LargeImage} from '../utils/fragments'; // eslint-disable-line no-unused-vars

export const pageQuery = graphql`
	query contactPageV2Query($id: String!) {
		currentPage: wordpressPage(id: {eq: $id}) {
			...Page
			acf {
				title: contactTitle
				info: contactInfo {
					phone
					email
				}
				form: contactForm {
					form
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
	}
`;
