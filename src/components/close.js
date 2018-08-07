import React, {Component} from 'react';
import PropTypes from 'prop-types';

import CSS from '../css/modules/close.module.scss';
import {noop} from '../utils/componentHelpers';

export default class Close extends Component {
	static propTypes = {
		size: PropTypes.number,
		backgroundColor: PropTypes.string,
		onClick: PropTypes.func
	};

	static defaultProps = {
		size: 33,
		backgroundColor: 'white',
		onClick: noop
	};

	render() {
		const {size, backgroundColor, onClick: handleClick} = this.props;

		const wrap = {
			height: size - 1,
			width: size - 1
		};

		const lineStyle = {
			height: size,
			backgroundColor
		};

		return (
			<div className={CSS.wrap} style={wrap} onClick={handleClick}>
				<span className={CSS.before} style={lineStyle}/>
				<span className={CSS.after} style={lineStyle}/>
			</div>
		);
	}
}
