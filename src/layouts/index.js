import React, {Component} from 'react';
import PropTypes from 'prop-types';
import graphql from 'graphql';

import './styles';

import Header from '../components/header';
import Footer from '../components/footer';
import {getDataTheme} from '../utils/documentHelpers';
import Salesloft from '../scripts/salesloft';

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
		const {location} = this.props;
		const {mainMenu, site} = this.props.data;

		return (
			<div id="site" data-theme={getDataTheme(location)} data-theme-toggle="true">
				<Header items={mainMenu.items} location={location}/>
				{this.props.children({...this.props, site})}
				<Footer menu={mainMenu} location={location}/>
				<Salesloft key={location.pathname}/>
			</div>
		);
	}
}

export const layoutQuery = graphql`
	query mainLayoutQuery {
		mainMenu: wordpressWpApiMenusMenusItems(name: {eq: "Primary Navigation"}) {
			...MenuItems
		}
		site {
			...Site
		}
	}
`;
