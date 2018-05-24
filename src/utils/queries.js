import graphql from 'graphql';

export const MainMenuQuery = graphql`
	query MainMenuQuery {
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
	}
`;
