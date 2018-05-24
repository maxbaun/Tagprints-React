import React, {Component} from 'react';
import PropTypes from 'prop-types';
import graphql from 'graphql';

import Fragment from '../components/fragment';
import Image from '../components/image';
import Location from '../components/location';
import Form from '../components/form';
import Seo from '../components/seo';
import CSS from '../css/modules/contact.module.scss';
import {emailLink, phoneLink} from '../utils/componentHelpers';

export default class ContactPageTemplate extends Component {
	static propTypes = {
		data: PropTypes.object.isRequired,
		location: PropTypes.object.isRequired
	};

	render() {
		const {currentPage, site} = this.props.data;

		const {info, form, locations} = currentPage.acf;

		return (
			<Fragment>
				<Seo
					currentPage={currentPage}
					site={site}
					location={this.props.location}
				/>
				<main className="main" role="main">
					<div className={CSS.wrap}>
						<div className={CSS.header}>
							<div className="container">
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
						</div>
						<div className={CSS.form}>
							<div className="container">
								<div className={CSS.formImage}>
									<Image
										resolutions={
											form.image.localFile.childImageSharp
												.resolutions
										}
									/>
								</div>
								<Form
									location={this.props.location}
									formId={form.form}
									labelPlacement={form.labelPlacement}
								/>
							</div>
						</div>
						<div className={CSS.locationSection}>
							<ul className={CSS.locations}>
								{locations &&
									locations.map(location => {
										return (
											<li
												key={location.title}
												className={CSS.location}
											>
												<Location
													key={location.title}
													{...location}
												/>
											</li>
										);
									})}
							</ul>
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
