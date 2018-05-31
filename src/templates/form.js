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
		location: PropTypes.object.isRequired,
		site: PropTypes.object.isRequired
	};

	render() {
		const {currentPage} = this.props.data;

		const {content, form} = currentPage.acf;

		return (
			<Fragment>
				<Seo currentPage={currentPage} site={this.props.site} location={this.props.location}/>
				<main className="main" role="main">
					<div className={CSS.wrap}>
						<div className="container">
							<div className={CSS.content}>
								{content.view === 'image' ? (
									<div className={CSS.image}>
										<Img
											style={{
												width: 222,
												margin: '0 auto'
											}}
											sizes={content.image.localFile.childImageSharp.sizes}
										/>
									</div>
								) : (
									<div
										// eslint-disable-next-line react/no-danger
										dangerouslySetInnerHTML={innerHtml(content.content)}
										className={CSS.text}
									/>
								)}
							</div>
							{form.form && form.form !== '' ? (
								<div className={CSS.form}>
									<Form location={this.props.location} formId={form.form} labelPlacement={form.labelPlacement}/>
								</div>
							) : null}
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
	query formPageQuery($id: String!) {
		currentPage: wordpressPage(id: {eq: $id}) {
			...Page
			acf {
				content: formContent {
					view
					content
					image {
						...LargeImage
					}
				}
				form: formForm {
					labelPlacement: field_label
					form
				}
			}
		}
	}
`;
