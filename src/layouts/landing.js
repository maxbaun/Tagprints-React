import React, {Component} from 'react';
import PropTypes from 'prop-types';
import graphql from 'graphql';

import './styles';

import {getDataTheme} from '../utils/documentHelpers';

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
		const {site} = this.props.data;

		return (
			<div id="site" data-theme={getDataTheme(location)} data-theme-toggle="true">
				{this.props.children({...this.props, site})}
			</div>
		);
	}
}

export const layoutQuery = graphql`
	query landingLayoutQuery {
		site {
			...Site
		}
	}
`;
