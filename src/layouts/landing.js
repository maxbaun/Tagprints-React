import React, {Component} from 'react';
import PropTypes from 'prop-types';
import graphql from 'graphql';

import './styles';
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
		const {site} = this.props.data;

		return (
			<div id="site" data-theme="landing" data-theme-toggle="true">
				{this.props.children({...this.props, site})}
				<Salesloft key={this.props.location.pathname}/>

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
