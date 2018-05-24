import React, {Component} from 'react';
import PropTypes from 'prop-types';
import graphql from 'graphql';
import Img from 'gatsby-image';

import {innerHtml} from '../utils/wordpressHelpers';
import Fragment from '../components/fragment';
import Form from '../components/form';
import Seo from '../components/seo';
import CSS from '../css/modules/formPage.module.scss';

export default class FormTemplate extends Component {
	static propTypes = {
		data: PropTypes.object.isRequired,
		location: PropTypes.object.isRequired
	};

	render() {
		const {currentPage, site} = this.props.data;

		const {content, form} = currentPage.acf;

		return (
			<Fragment>
				<Seo
					currentPage={currentPage}
					site={site}
					location={this.props.location}
				/>
				<main className="main" role="main">
					<div className={CSS.wrap}>
						<div className="container">
							<div className={CSS.content}>
								{content.view === 'image' ? (
									<div className={CSS.image}>
										<Img
											resolutions={
												content.image.localFile
													.childImageSharp.resolutions
											}
										/>
									</div>
								) : (
									<div
										// eslint-disable-next-line react/no-danger
										dangerouslySetInnerHTML={innerHtml(
											content.content
										)}
										className={CSS.text}
									/>
								)}
							</div>
							<div className={CSS.form}>
								<Form
									location={this.props.location}
									formId={form.form}
									labelPlacement={form.labelPlacement}
								/>
							</div>
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
	query formPageQuery($id: String!) {
		currentPage: wordpressPage(id: {eq: $id}) {
			...Page
			acf {
				content: formContent {
					view
					content
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
				form: formForm {
					labelPlacement: field_label
					form
				}
			}
		}
		site {
			...Site
		}
	}
`;
