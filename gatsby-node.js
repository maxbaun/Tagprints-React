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
						'http://tagprints.info/wp-json' :
						'http://tagprints.com/wp-json'
				),
				GRAVITY_FORMS_API: JSON.stringify(
					isDev ?
						'http://tagprints.info/gravityformsapi' :
						'http://tagprints.com/gravityformsapi'
				),
				GRAVITY_FORMS_PUBLIC_KEY: JSON.stringify(
					isDev ? '4a60f91bc9' : ''
				),
				GRAVITY_FORMS_PRIVATE_KEY: JSON.stringify(
					isDev ? 'f226e7f31e4acc7' : ''
				),
				RECAPTCHA_KEY: JSON.stringify(
					isDev ? '6Lc3bVkUAAAAAL4_17gRz37kERS4_AoWoDfhMLCf' : ''
				),
				RECAPTCHA_SECRET: JSON.stringify(
					isDev ? '6Lc3bVkUAAAAAMvfWaEzXwm4xBs7VHuWh0MmuZW5' : ''
				)
			})
		]
	});

	return config;
};

exports.createPages = ({graphql, boundActionCreators}) => {
	const {createPage} = boundActionCreators;
	return Promise.all([getPages(graphql, createPage)]);
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
				if (edge.node.title === 'TagPrints Homepage') {
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

	return path.resolve(`./src/templates/page.js`);
}
