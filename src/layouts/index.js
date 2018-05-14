import React, {Component} from 'react';
import PropTypes from 'prop-types';
import graphql from 'graphql';

import '../css/main.scss';

import Header from '../components/header';
import Footer from '../components/footer';

export default class DefaultLayout extends Component {
	static propTypes = {
		children: PropTypes.func.isRequired,
		data: PropTypes.object.isRequired
	}

	render() {
		const {mainMenu} = this.props.data;

		return (
			<div>
				<Header items={mainMenu.items}/>
				{this.props.children()}
				<Footer menu={mainMenu}/>
			</div>
		);
	}
}

export const layoutQuery = graphql`
query mainMenuQuery {
	mainMenu: wordpressWpApiMenusMenusItems(name: {eq: "Primary Navigation"}) {
	  items{
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
