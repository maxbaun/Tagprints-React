import React from 'react';
import PropTypes from 'prop-types';

import CSS from '../css/modules/modal.module.scss';

const ModalContent = ({classname, children}) => {
	const wrapClass = [CSS.content, classname ? CSS[classname] : ''];
	return <div className={wrapClass.join(' ')}>{children}</div>;
};

ModalContent.propTypes = {
	classname: PropTypes.string,
	children: PropTypes.node
};

ModalContent.defaultProps = {
	classname: null,
	children: null
};

export default ModalContent;
