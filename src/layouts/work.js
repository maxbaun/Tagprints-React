import React, {Component} from 'react';
import PropTypes from 'prop-types';
import graphql from 'graphql';

import './styles';

import Header from '../components/header';
import Footer from '../components/footer';
import WorkHeader from '../components/workHeader';
import Fragment from '../components/fragment';

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

		return (
			<Fragment>
				<Header items={mainMenu.items}/>
				<WorkHeader location={this.props.location}/>
				{this.props.children({...this.props, site})}
				<Footer menu={mainMenu}/>
			</Fragment>
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
