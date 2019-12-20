import React, {Component} from 'react';
import PropTypes from 'prop-types';
import graphql from 'graphql';

import './styles';

import Header from '../components/header';
import Footer from '../components/footer';
import WorkHeader from '../components/workHeader';
import {getDataTheme} from '../utils/documentHelpers';
import Salesloft from '../scripts/salesloft';

export default class WorkLayout extends Component {
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
		const {location} = this.props;

		return (
			<div id="site" data-theme={getDataTheme(location)} data-theme-toggle="true">
				<Header items={mainMenu.items} location={location}/>
				<WorkHeader location={this.props.location}/>
				{this.props.children({...this.props, site})}
				<Footer menu={mainMenu} location={location}/>
				<Salesloft key={this.props.location.pathname}/>
			</div>
		);
	}
}

export const layoutQuery = graphql`
	query workLayoutQuery {
		mainMenu: wordpressWpApiMenusMenusItems(name: {eq: "Primary Navigation"}) {
			...MenuItems
		}
		site {
			...Site
		}
	}
`;
