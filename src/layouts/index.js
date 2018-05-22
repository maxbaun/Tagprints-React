import React, {Component} from 'react';
import PropTypes from 'prop-types';
import graphql from 'graphql';

import '../css/main.scss';
import '../css/vendor/animate.css';

import Header from '../components/header';
import Footer from '../components/footer';

export default class DefaultLayout extends Component {
	static propTypes = {
		children: PropTypes.func.isRequired,
		data: PropTypes.object,
		location: PropTypes.object.isRequired
	};

	static defaultProps = {
		data: {}
	};

	componentDidMount() {
		this.setDataTheme(this.props.location);
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.location.pathname !== this.props.location.pathname) {
			this.setDataTheme(nextProps.location);
		}
	}

	setDataTheme(location) {
		const {pathname} = location;
		let dataTheme = 'default';

		if (pathname.includes('array13')) {
			dataTheme = 'array13';
		}

		if (pathname.includes('photo') && pathname.includes('lite')) {
			dataTheme = 'photobooth-lite';
		}

		const body = document.querySelector('body');
		body.setAttribute('data-theme', dataTheme);
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
