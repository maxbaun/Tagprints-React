module.exports = {
	siteMetadata: {
		siteUrl: `https://tagprints.com`,
		title: `TagPrints`,
		subtitle: `Hashtag Printers and Social Photo Booth rentals built to capture branded memories at your events. From turnkey solutions to totally custom, challenge us!`
	},
	plugins: [
		`gatsby-plugin-sass`,
		// https://public-api.wordpress.com/wp/v2/sites/gatsbyjsexamplewordpress.wordpress.com/pages/
		/*
		* Gatsby's data processing layer begins with “source”
		* plugins. Here the site sources its data from Wordpress.
		*/
		{
			resolve: `gatsby-source-wordpress`,
			options: {
				/*
				* The base URL of the Wordpress site without the trailingslash and the protocol. This is required.
				* Example : 'gatsbyjswpexample.wordpress.com' or 'www.example-site.com'
				*/
				baseUrl: `admin.tagprints.com`,
				// The protocol. This can be http or https.
				protocol: `https`,
				// Indicates whether the site is hosted on wordpress.com.
				// If false, then the asumption is made that the site is self hosted.
				// If true, then the plugin will source its content on wordpress.com using the JSON REST API V2.
				// If your site is hosted on wordpress.org, then set this to false.
				hostingWPCOM: false,
				// If useACF is true, then the source plugin will try to import the Wordpress ACF Plugin contents.
				// This feature is untested for sites hosted on Wordpress.com
				useACF: true,
				verboseOutput: true,
				concurrentRequests: 10,
				excludedRoutes: [
					'/yoast/v1',
					'/gf/v2/forms/schema',
					'/acf/v3/posts',
					'/acf/v3/pages',
					'/acf/v3/case-study',
					'/acf/v3/lookbook',
					'/acf/v3/categories',
					'/acf/v3/case-study-category',
					'/wp-api-menus/v2/menu-locations'
				]
			}
		},
		`gatsby-transformer-sharp`,
		`gatsby-plugin-sharp`,
		'gatsby-plugin-react-helmet',
		{
			resolve: `gatsby-plugin-intercom`,
			options: {
				appId: 'j6yjy1ql'
			}
		},
		{
			resolve: `gatsby-plugin-google-analytics`,
			options: {
				trackingId: `UA-43034131-1`
			}
		},
		{
			resolve: 'gatsby-plugin-facebook-pixel',
			options: {
				pixelId: '785276321503890'
			}
		},
		{
			resolve: `gatsby-plugin-sitemap`
		},
		{
			resolve: 'gatsby-plugin-robots-txt',
			options: {
				host: 'https://tagprints.com',
				sitemap: 'https://tagprints.com/sitemap.xml',
				policy: process.env.ENV === 'production' ? [{userAgent: '*', allow: '/'}] : [{userAgent: '*', disallow: ['/']}]
			}
		},
		{
			resolve: 'gatsby-plugin-webpack-bundle-analyzer',
			options: {
				analyzerPort: 3000,
				production: false
			}
		}
	]
};
