import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {ref, ScrollTo} from '../utils/componentHelpers';

export default class ScrollSpy extends Component {
	constructor(props) {
		super(props);

		this.scroll = null;

		this.handleClick = this.handleClick.bind(this);
	}

	static propTypes = {
		target: PropTypes.string.isRequired,
		children: PropTypes.element.isRequired
	};

	componentWillUnmount() {
		this.scroll = null;
	}

	handleClick(e) {
		e.preventDefault();

		this.scroll = new ScrollTo(this.props.target, {
			container: window,
			duration: 150
		});
	}

	render() {
		const props = {
			...this.props.children.props,
			onClick: this.handleClick
		};

		return React.cloneElement(this.props.children, props);
	}
}
