import graphql from 'graphql';

export const PageFragment = graphql`
fragment Page on wordpress__PAGE {
	id
	content
	title
	date(formatString: "MMMM DD, YYYY")
	excerpt
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
