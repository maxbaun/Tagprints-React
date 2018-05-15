import graphql from 'graphql';

export const PageFragment = graphql`
fragment Page on wordpress__PAGE {
	id
	content
	title
	date(formatString: "MMMM DD, YYYY")
	excerpt
	template
	yoast {
		metaKeywords: focuskw
		title: title
		metaDescription: metadesc
		linkdex
		metakeywords
		noIndex: meta_robots_noindex
		noFollow: meta_robots_nofollow
		meta_robots_adv
		canonical
		redirect
		ogTitle: opengraph_title
		ogDescription: opengraph_description
		ogImage: opengraph_image
		twitterTitle: twitter_title
		twitterDescription: twitter_description
		twitterImage: twitter_image
	}
}
`;

export const MenuItems = graphql`
fragment MenuItems on wordpress__wp_api_menus_menus_items {
	name
	items {
	  title
	  url
	  items: wordpress_children {
		title
		url
	  }
	}
  }
`;

export const Site = graphql`
fragment Site on Site {
	id
	siteMeta :siteMetadata {
		title
		subtitle
	}
}
`;
