import React, {Component} from 'react';
import PropTypes from 'prop-types';
import graphql from 'graphql';

import '../css/main.scss';
import '../css/utils/animations.scss';
import '../css/vendor/animate.css';

import Header from '../components/header';
import Footer from '../components/footer';
import Fragment from '../components/fragment';

export default class DefaultLayout extends Component {
	static propTypes = {
		children: PropTypes.func.isRequired,
		data: PropTypes.object,
		location: PropTypes.object.isRequired
	};

	static defaultProps = {
		data: {}
	};

	render() {
		const {mainMenu, site} = this.props.data;

		return (
			<Fragment>
				<Header items={mainMenu.items}/>
				{this.props.children({...this.props, site})}
				<Footer menu={mainMenu}/>
			</Fragment>
		);
	}
}

export const layoutQuery = graphql`
	query mainLayoutQuery {
		mainMenu: wordpressWpApiMenusMenusItems(
			name: {eq: "Primary Navigation"}
		) {
			...MenuItems
		}
		site {
			...Site
		}
	}
`;
