import React from 'react';
import {Router} from 'react-router-dom';
import {RouterToUrlQuery} from 'react-url-query';
import PropTypes from 'prop-types';

exports.replaceRouterComponent = ({history}) => {
	const ConnectedRouterWrapper = ({children}) => (
		<Router history={history}>
			<RouterToUrlQuery>
				{children}
			</RouterToUrlQuery>
		</Router>
	);

	ConnectedRouterWrapper.propTypes = {
		children: PropTypes.node.isRequired
	};

	return ConnectedRouterWrapper;
};
