import React from 'react';
import PropTypes from 'prop-types';

const [reactMajorVersion] = React.version.split('.');
const canReturnArray = parseInt(reactMajorVersion, 10) >= 16;

const Fragment = ({children, as: Wrapper, ...props}) => {
	return Wrapper ? (
		<Wrapper {...props}>{children}</Wrapper>
	) : (
		React.Children.toArray(children)
	);
};

Fragment.propTypes = {
	children: PropTypes.node.isRequired,
	as: PropTypes.oneOfType([PropTypes.string, PropTypes.func])
};

Fragment.defaultProps = {
	as: canReturnArray ? undefined : 'div'
};

export default (React.Fragment ? React.Fragment : Fragment);
