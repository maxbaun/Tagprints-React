import React, {Component} from 'react';
import PropTypes from 'prop-types';
import graphql from 'graphql';
import Img from 'gatsby-image';

import {innerHtml} from '../utils/wordpressHelpers';
import Seo from '../components/seo';
import ScrollSpy from '../components/scrollSpy';
import CSS from '../css/modules/caseStudy.module.scss';

export default class CaseStudyTemplate extends Component {
	static propTypes = {
		data: PropTypes.object.isRequired,
		location: PropTypes.object.isRequired
	};

	render() {
		const {caseStudy, site} = this.props.data;

		return (
			<div>
				<Seo
					currentPage={caseStudy}
					site={site}
					location={this.props.location}
				/>
				<main className="main" role="main">
					<div className={CSS.caseStudy}>
						<div className={CSS.hero}>
							<div className={CSS.heroImage}>
								<Img
									sizes={
										caseStudy.acf.hero.localFile
											.childImageSharp.full
									}
								/>
							</div>
							<div className={CSS.heroInner}>
								<div className={CSS.scrollWrap}>
									<ScrollSpy target="#caseStudyContent">
										<div className={CSS.scroll}>
											<span className="fa fa-angle-down"/>
										</div>
									</ScrollSpy>
								</div>
							</div>
						</div>
						<div id="caseStudyContent" className={CSS.body}>
							<div className="container">
								<div className="row">
									<div className="col-sm-4">
										<div
											// eslint-disable-next-line react/no-danger
											dangerouslySetInnerHTML={innerHtml(
												caseStudy.content
											)}
											className={CSS.content}
										/>
									</div>
									<div className="col-sm-8">
										<div className={CSS.images}>images</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</main>
			</div>
		);
	}
}

export const pageQuery = graphql`
	query caseStudyQuery($id: String!) {
		caseStudy: wordpressWpCaseStudy(id: {eq: $id}) {
			title
			content
			yoast {
				...CaseStudyYoast
			}
			image: featured_media {
				localFile {
					childImageSharp {
						full: sizes(maxWidth: 1600) {
							base64
							aspectRatio
							src
							srcSet
							srcWebp
							srcSetWebp
							sizes
							originalImg
							originalName
						}
					}
				}
			}
			acf {
				logo
				subtitle
				hero: caseStudyHero {
					localFile {
						childImageSharp {
							full: sizes(maxWidth: 1600) {
								base64
								aspectRatio
								src
								srcSet
								srcWebp
								srcSetWebp
								sizes
								originalImg
								originalName
							}
						}
					}
				}
				images: caseStudyImages {
					width
					image {
						url: source_url
						mediaDetails: media_details {
							width
							height
						}
						localFile {
							childImageSharp {
								sizes(maxWidth: 800) {
									base64
									aspectRatio
									src
									srcSet
									srcWebp
									srcSetWebp
									sizes
									originalImg
									originalName
								}
							}
						}
					}
				}
			}
		}
		site {
			...Site
		}
	}
`;
