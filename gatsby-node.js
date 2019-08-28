const webpack = require('webpack');
const slash = require('slash');
const Promise = require('bluebird');
const path = require('path');

exports.modifyWebpackConfig = ({config}) => {
	const isDev = process.env.NODE_ENV === 'development';

	if (isDev) {
		require('dotenv').config({
			path: '.env'
		});
	}

	config.merge({
		plugins: [
			new webpack.DefinePlugin({
				API_URL: JSON.stringify(process.env.API_URL),
				GRAVITY_FORMS_API: JSON.stringify(process.env.GRAVITY_FORMS_API),
				GRAVITY_FORMS_PUBLIC_KEY: JSON.stringify(process.env.GRAVITY_FORMS_PUBLIC_KEY),
				GRAVITY_FORMS_PRIVATE_KEY: JSON.stringify(process.env.GRAVITY_FORMS_PRIVATE_KEY),
				RECAPTCHA_KEY: JSON.stringify(process.env.RECAPTCHA_KEY),
				RECAPTCHA_SECRET: JSON.stringify(process.env.RECAPTCHA_SECRET),
				MAILCHIMP_URL: JSON.stringify(process.env.MAILCHIMP_URL),
				MAILCHIMP_API_KEY: JSON.stringify(process.env.MAILCHIMP_API_KEY),
				MAILCHIMP_REGION: JSON.stringify(process.env.MAILCHIMP_REGION),
				MAILCHIMP_LIST: JSON.stringify(process.env.MAILCHIMP_LIST)
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
				if (edge.node.title === 'TagPrints Homepage' || edge.node.slug === 'our-work') {
					return;
				}

				createPage({
					path: getSlug(edge, result.data.pages.edges),
					component: slash(getPageTemplate(edge.node.template)),
					layout: getPageLayout(edge.node.template),
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
			component: slash(path.resolve('./src/templates/caseStudies.js'))
		});

		createPage({
			path: '/our-work/lookbook',
			layout: 'work',
			component: slash(path.resolve('./src/templates/lookbooks.js'))
		});

		createPage({
			path: '/our-work/case-studies',
			layout: 'work',
			component: slash(path.resolve('./src/templates/caseStudies.js')),
			context: {
				view: 'caseStudies'
			}
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
					component: slash(path.resolve('./src/templates/lookbooks.js')),
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
					component: slash(path.resolve('./src/templates/caseStudies.js')),
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
					component: slash(path.resolve('./src/templates/caseStudy.js')),
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
		return path.resolve('./src/templates/contactv2.js');
	}

	if (template === 'template-photobooth-lite.php') {
		return path.resolve('./src/templates/pbl.js');
	}

	if (template === 'template-photobooth-pro.php') {
		return path.resolve('./src/templates/pbp.js');
	}

	if (template === 'template-array13-v2.php') {
		return path.resolve('./src/templates/array13.js');
	}

	if (template === 'template-free-quote-v2.php') {
		return path.resolve('./src/templates/quotev2.js');
	}

	if (template === 'template-thanks.php') {
		return path.resolve('./src/templates/thanks.js');
	}

	if (template === 'template-landing.php') {
		return path.resolve('./src/templates/landing.js');
	}

	if (template === 'template-experience.php') {
		return path.resolve('./src/templates/experience.js');
	}

	if (template === 'template-originals.php') {
		return path.resolve('./src/templates/originals.js');
	}

	return path.resolve(`./src/templates/page.js`);
}

function getPageLayout(template) {
	if (template === 'template-landing.php') {
		return 'landing';
	}

	return 'index';
}
