const webpack = require('webpack');
const slash = require('slash');
const Promise = require('bluebird');
const path = require('path');

exports.modifyWebpackConfig = ({config}) => {
	const isDev = process.env.NODE_ENV === 'development';
	config.merge({
		plugins: [
			new webpack.DefinePlugin({
				API_URL: JSON.stringify(
					isDev ?
						'https://admin.tagprints.com/wp-json' :
						'https://admin.tagprints.com/wp-json'
				),
				GRAVITY_FORMS_API: JSON.stringify(
					isDev ?
						'https://admin.tagprints.com/gravityformsapi' :
						'https://admin.tagprints.com/gravityformsapi'
				),
				GRAVITY_FORMS_PUBLIC_KEY: JSON.stringify(
					isDev ? '4a60f91bc9' : '4a60f91bc9'
				),
				GRAVITY_FORMS_PRIVATE_KEY: JSON.stringify(
					isDev ? 'f226e7f31e4acc7' : 'f226e7f31e4acc7'
				),
				RECAPTCHA_KEY: JSON.stringify(
					isDev ?
						'6Lc3bVkUAAAAAL4_17gRz37kERS4_AoWoDfhMLCf' :
						'6Lc3bVkUAAAAAL4_17gRz37kERS4_AoWoDfhMLCf'
				),
				RECAPTCHA_SECRET: JSON.stringify(
					isDev ?
						'6Lc3bVkUAAAAAMvfWaEzXwm4xBs7VHuWh0MmuZW5' :
						'6Lc3bVkUAAAAAMvfWaEzXwm4xBs7VHuWh0MmuZW5'
				)
			})
		]
	});

	return config;
};

exports.createPages = ({graphql, boundActionCreators}) => {
	const {createPage} = boundActionCreators;
	return Promise.all([
		getPages(graphql, createPage),
		getPosts(graphql, createPage),
		createOurWorkPage(graphql, createPage),
		createLookbookPages(graphql, createPage),
		createCaseStudiesRoot(graphql, createPage),
		createCaseStudyCategories(graphql, createPage),
		createCaseStudies(graphql, createPage)
	]);
};

function getPages(graphql, createPage) {
	return new Promise((resolve, reject) => {
		graphql(
			`
				{
					pages: allWordpressPage {
						edges {
							node {
								id
								title
								wpid: wordpress_id
								slug
								status
								template
								parent: wordpress_parent
							}
						}
					}
				}
			`
		).then(result => {
			if (result.errors) {
				console.log(result.errors);
				reject(result.errors);
			}

			if (!result.data) {
				return resolve();
			}

			result.data.pages.edges.forEach(edge => {
				if (
					edge.node.title === 'TagPrints Homepage' ||
					edge.node.slug === 'our-work'
				) {
					return;
				}

				createPage({
					path: getSlug(edge, result.data.pages.edges),
					component: slash(getPageTemplate(edge.node.template)),
					context: {
						id: edge.node.id
					}
				});
			});

			resolve();
		});
	});
}

function getPosts(graphql, createPage) {
	return new Promise((resolve, reject) => {
		graphql(
			`
				{
					posts: allWordpressPost {
						edges {
							node {
								id
								title
								wpid: wordpress_id
								slug
								status
							}
						}
					}
				}
			`
		).then(result => {
			if (result.errors) {
				console.log(result.errors);
				reject(result.errors);
			}

			if (!result.data) {
				return resolve();
			}

			result.data.posts.edges.forEach(edge => {
				createPage({
					path: `/${edge.node.slug}`,
					component: slash(path.resolve('./src/templates/post.js')),
					context: {
						id: edge.node.id
					}
				});
			});

			resolve();
		});
	});
}

function createOurWorkPage(graphql, createPage) {
	return new Promise(resolve => {
		createPage({
			path: '/our-work',
			layout: 'work',
			component: slash(path.resolve('./src/templates/lookbooks.js'))
		});

		createPage({
			path: '/our-work/lookbook',
			layout: 'work',
			component: slash(path.resolve('./src/templates/lookbooks.js'))
		});

		resolve();
	});
}

function createLookbookPages(graphql, createPage) {
	return new Promise((resolve, reject) => {
		return graphql(
			`
				{
					pages: allWordpressWpLookbook {
						edges {
							node {
								id
								title
								wpid: wordpress_id
								slug
							}
						}
					}
				}
			`
		).then(result => {
			if (result.errors) {
				console.log(result.errors);
				reject(result.errors);
			}

			if (!result.data) {
				return resolve();
			}

			result.data.pages.edges.forEach(edge => {
				createPage({
					path: `/our-work/lookbook/${edge.node.slug}`,
					layout: 'work',
					component: slash(
						path.resolve('./src/templates/lookbooks.js')
					),
					context: {
						view: 'lookbook',
						lookbookId: edge.node.slug
					}
				});
			});

			resolve();
		});
	});
}

function createCaseStudiesRoot(graphql, createPage) {
	return new Promise(resolve => {
		createPage({
			path: '/our-work/case-studies',
			layout: 'work',
			component: slash(path.resolve('./src/templates/caseStudies.js')),
			context: {
				view: 'caseStudies'
			}
		});

		return resolve();
	});
}

function createCaseStudyCategories(graphql, createPage) {
	return new Promise((resolve, reject) => {
		graphql(
			`
				{
					categories: allWordpressWpCaseStudyCategory {
						edges {
							node {
								id
								wpid: wordpress_id
								slug
							}
						}
					}
				}
			`
		).then(result => {
			if (result.errors) {
				console.log(result.errors);
				reject(result.errors);
			}

			if (!result.data) {
				return resolve();
			}

			result.data.categories.edges.forEach(edge => {
				createPage({
					path: `/our-work/case-studies/${edge.node.slug}`,
					layout: 'work',
					component: slash(
						path.resolve('./src/templates/caseStudies.js')
					),
					context: {
						caseStudyCategoryId: edge.node.wpid,
						view: 'caseStudies'
					}
				});
			});

			resolve();
		});
	});
}

function createCaseStudies(graphql, createPage) {
	return new Promise((resolve, reject) => {
		graphql(
			`
				{
					pages: allWordpressWpCaseStudy {
						edges {
							node {
								id
								title
								wpid: wordpress_id
								slug
								status
							}
						}
					}
				}
			`
		).then(result => {
			if (result.errors) {
				console.log(result.errors);
				reject(result.errors);
			}

			if (!result.data) {
				return resolve();
			}

			result.data.pages.edges.forEach(edge => {
				createPage({
					path: `/case-study/${edge.node.slug}`,
					component: slash(
						path.resolve('./src/templates/caseStudy.js')
					),
					context: {
						id: edge.node.id
					}
				});
			});

			resolve();
		});
	});
}

function getSlug(edge, edges) {
	if (!edge.node.parent) {
		return `/${edge.node.slug}`;
	}

	const parent = edges.find(e => e.node.wpid === edge.node.parent);

	return getSlug(parent, edges) + `/${edge.node.slug}`;
}

function getPageTemplate(template) {
	if (template === 'template-hashtag.php') {
		return path.resolve('./src/templates/hashtag.js');
	}

	if (template === 'template-team.php') {
		return path.resolve('./src/templates/team.js');
	}

	if (template === 'template-form.php') {
		return path.resolve('./src/templates/form.js');
	}

	if (template === 'template-job.php') {
		return path.resolve('./src/templates/job.js');
	}

	if (template === 'template-contact.php') {
		return path.resolve('./src/templates/contact.js');
	}

	if (template === 'template-photobooth-lite.php') {
		return path.resolve('./src/templates/pbl.js');
	}

	if (template === 'template-photobooth-pro.php') {
		return path.resolve('./src/templates/pbp.js');
	}

	return path.resolve(`./src/templates/page.js`);
}
