import React, {Component} from 'react';
import PropTypes from 'prop-types';
import graphql from 'graphql';

import {innerHtml} from '../utils/wordpressHelpers';
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
		location: PropTypes.object.isRequired
	};

	getLightboxImages() {
		const {images} = this.props.data.currentPage.acf;

		const featuredImage = {
			full: images.featuredImage.full,
			thumbnail: images.featuredImage.thumbnail,
			url: images.featuredImage.url
		};

		const gridImages = images.gallery.map(image => {
			return {
				full: image.full,
				thumbnail: image.thumbnail,
				url: image.url
			};
		});

		return [featuredImage, ...gridImages];
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
		const {currentPage, site} = this.props.data;

		const {content, images, form} = currentPage.acf;

		return (
			<Fragment>
				<Seo
					currentPage={currentPage}
					site={site}
					location={this.props.location}
				/>
				<main className="main" role="main">
					<div className={CSS.wrap}>
						<div className="row">
							<div className="col-sm-6">
								<div className={CSS.content}>
									<h1>{currentPage.title}</h1>
									<div // eslint-disable-next-line react/no-danger
										dangerouslySetInnerHTML={innerHtml(
											content.content
										)}
									/>
								</div>
							</div>
							<div className="col-sm-6">
								<div
									className={CSS.featuredImage}
									onClick={click(this.handleModalOpen, 1)}
								>
									<Image
										sizes={
											images.featuredImage.thumbnail
												.childImageSharp.sizes
										}
									/>
								</div>
								<div className={CSS.gallery}>
									<ul>
										{images.gallery.map((image, index) => {
											const resolutions = image.thumbnail
												.childImageSharp ?
												image.thumbnail
													.childImageSharp
													.resolutions :
												{};

											return (
												<li
													key={
														resolutions.src ||
														image.url
													}
													onClick={click(
														this.handleModalOpen,
														index + 2
													)}
												>
													<Image
														url={image.url}
														resolutions={
															resolutions
														}
													/>
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
							<Form
								location={this.props.location}
								formId={form.form}
							/>
						</div>
					</div>
				</main>
				<Lightbox
					images={this.getLightboxImages()}
					open={this.state.modalOpen}
					start={this.state.modalStart}
					onClose={this.handleModalClose}
				/>
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
	query jobPageQuery($id: String!) {
		currentPage: wordpressPage(id: {eq: $id}) {
			...Page
			acf {
				content: jobContent {
					content
				}
				images: jobImage {
					featuredImage {
						url: source_url
						thumbnail: localFile {
							childImageSharp {
								sizes(maxWidth: 460) {
									base64
									aspectRatio
									src
									srcSet
									sizes
									originalImg
								}
							}
						}
						full: localFile {
							childImageSharp {
								sizes {
									base64
									aspectRatio
									src
									srcSet
									sizes
									originalImg
								}
							}
						}
					}
					gallery {
						url: source_url
						thumbnail: localFile {
							childImageSharp {
								resolutions(width: 250, height: 250) {
									base64
									aspectRatio
									src
									srcSet
									width
									height
								}
							}
						}
						full: localFile {
							childImageSharp {
								resolutions {
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
				form: jobForm {
					title
					form
				}
			}
		}
		site {
			...Site
		}
	}
`;
