import React, {Component} from 'react';
import PropTypes from 'prop-types';
import graphql from 'graphql';

import '../css/main.scss';
import '../css/vendor/animate.css';

import Header from '../components/header';
import Footer from '../components/footer';
import Fragment from '../components/fragment';

export default class WorkLayout extends Component {
	static propTypes = {
		children: PropTypes.func.isRequired,
		data: PropTypes.object,
		location: PropTypes.object.isRequired
	};

	static defaultProps = {
		data: {}
	};

	componentDidMount() {
		this.setDataTheme(this.props.location);
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.location.pathname !== this.props.location.pathname) {
			this.setDataTheme(nextProps.location);
		}
	}

	setDataTheme(location) {
		const {pathname} = location;
		let dataTheme = 'default';

		if (pathname.includes('array13')) {
			dataTheme = 'array13';
		}

		if (pathname.includes('photo') && pathname.includes('lite')) {
			dataTheme = 'photobooth-lite';
		}

		const body = document.querySelector('body');
		body.setAttribute('data-theme', dataTheme);
	}

	render() {
		const {mainMenu} = this.props.data;

		console.log(this.context);
		console.log(this.props.data);

		return (
			<Fragment>
				<Header items={mainMenu.items}/>
				our-work
				<Footer menu={mainMenu}/>
			</Fragment>
		);
	}
}

export const workLayoutQuery = graphql`
	query workMainQuery($lookbookId: String, $caseStudyCategoryId: Int) {
		mainMenu: wordpressWpApiMenusMenusItems(
			name: {eq: "Primary Navigation"}
		) {
			items {
				title
				url
				classes
				children: wordpress_children {
					title
					url
				}
			}
		}
		lookbooks: allWordpressWpLookbook(filter: {id: {eq: $lookbookId}}) {
			edges {
				node {
					id
					title
					acf {
						gallery {
							url: source_url
							localFile {
								childImageSharp {
									sizes(maxWidth: 450) {
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
		}
		caseStudies: allWordpressWpCaseStudy(
			filter: {case_study_category: {eq: $caseStudyCategoryId}}
		) {
			edges {
				node {
					title
					content
					slug
					acf {
						logo
						subtitle
					}
				}
			}
		}
		caseStudyCategories: allWordpressWpCaseStudyCategory {
			edges {
				node {
					name
					slug
				}
			}
		}
	}
`;
