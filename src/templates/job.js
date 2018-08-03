import React, {Component} from 'react';
import PropTypes from 'prop-types';
import graphql from 'graphql';

import {innerHtml, getLightboxImageObject} from '../utils/wordpressHelpers';
import {click} from '../utils/componentHelpers';
import Image from '../components/image';
import Form from '../components/form';
import Lightbox from '../components/lightbox';
import Seo from '../components/seo';
import Fragment from '../components/fragment';
import CSS from '../css/modules/job.module.scss';

export default class JobTemplate extends Component {
	constructor(props) {
		super(props);

		this.state = {
			modalOpen: false,
			modalStart: 1
		};

		this.getLightboxImages = this.getLightboxImages.bind(this);
		this.handleModalOpen = this.handleModalOpen.bind(this);
		this.handleModalClose = this.handleModalClose.bind(this);
	}

	static propTypes = {
		data: PropTypes.object.isRequired,
		location: PropTypes.object.isRequired,
		site: PropTypes.object.isRequired
	};

	getLightboxImages() {
		const {images} = this.props.data.currentPage.acf;
		const {featuredImage, gallery} = images;

		const gridImages = gallery.map(getLightboxImageObject);

		return [getLightboxImageObject(featuredImage), ...gridImages];
	}

	handleModalOpen(modalStart) {
		this.setState({
			modalOpen: true,
			modalStart
		});
	}

	handleModalClose() {
		this.setState({modalOpen: false});
	}

	render() {
		const {currentPage} = this.props.data;

		const {content, images, form} = currentPage.acf;

		return (
			<Fragment>
				<Seo currentPage={currentPage} site={this.props.site} location={this.props.location}/>
				<main className="main" role="main">
					<div className={CSS.wrap}>
						<div className="row">
							<div className="col-sm-6">
								<div className={CSS.content}>
									<h1>{currentPage.title}</h1>
									<div // eslint-disable-next-line react/no-danger
										dangerouslySetInnerHTML={innerHtml(content.content)}
									/>
								</div>
							</div>
							<div className="col-sm-6">
								<div className={CSS.featuredImage} onClick={click(this.handleModalOpen, 0)}>
									<Image sizes={images.featuredImage.localFile.childImageSharp.sizes}/>
								</div>
								<div className={CSS.gallery}>
									<ul>
										{images.gallery.map((image, index) => {
											const resolutions =
												image.thumbnail && image.thumbnail.childImageSharp ? image.thumbnail.childImageSharp.resolutions : {};

											return (
												<li key={resolutions.src || image.url} onClick={click(this.handleModalOpen, index + 1)}>
													<Image url={image.url} resolutions={resolutions}/>
												</li>
											);
										})}
									</ul>
								</div>
							</div>
						</div>
					</div>
					<div className={CSS.form}>
						<div className="container">
							<h1>{form.title}</h1>
							<Form location={this.props.location} formId={form.form}/>
						</div>
					</div>
				</main>
				{this.state.modalOpen ? (
					<Lightbox
						images={this.getLightboxImages()}
						open={this.state.modalOpen}
						start={this.state.modalStart}
						onClose={this.handleModalClose}
					/>
				) : null}
			</Fragment>
		);
	}
}

import {LargeImage} from '../utils/fragments'; // eslint-disable-line no-unused-vars

export const pageQuery = graphql`
	query jobPageQuery($id: String!) {
		currentPage: wordpressPage(id: {eq: $id}) {
			...Page
			acf {
				content: jobContent {
					content
				}
				images: jobImage {
					featuredImage {
						...LargeImage
					}
					gallery {
						...LargeImage
					}
				}
				form: jobForm {
					title
					form
				}
			}
		}
	}
`;
