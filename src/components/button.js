import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Loader from './loader';
import {ref, unique} from '../utils/componentHelpers';

export default class Button extends Component {
	constructor(props) {
		super(props);

		this.state = {
			height: 0,
			width: 0
		};

		this.id = unique();
		this.button = null;
		this.handleResize = this.handleResize.bind(this);
		this.handleVisible = this.handleVisible.bind(this);
	}

	static propTypes = {
		classes: PropTypes.string,
		loading: PropTypes.bool,
		type: PropTypes.string,
		text: PropTypes.string,
		setSize: PropTypes.bool
	};

	static defaultProps = {
		classes: 'btn btn-primary',
		loading: false,
		type: 'button',
		text: 'Button',
		setSize: false
	};

	componentDidMount() {
		window.addEventListener('resize', this.handleResize);
		this.handleResize();
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.handleResize);
	}

	getId() {
		return `btn-${this.id}`;
	}

	clearPlaceholder() {
		const btn = Array.from(document.querySelectorAll(`#${this.getId()}`));

		if (!btn || btn.length === 0) {
			return;
		}

		btn.forEach(b => {
			const body = document.querySelector('body');
			body.removeChild(b);
		});
	}

	handleResize() {
		if (!this.button || !this.props.setSize) {
			return;
		}

		this.clearPlaceholder();

		const el = document.createElement('BUTTON');
		el.setAttribute('type', this.props.type);

		const classes = this.props.classes.split(' ');
		classes.forEach(cl => {
			el.classList.add(cl);
		});
		el.textContent = this.button.textContent;

		const body = document.querySelector('body');

		el.id = this.getId();
		el.style.position = 'absolute';
		el.style.opacity = 0;

		body.appendChild(el);

		this.setState({
			height: el.offsetHeight,
			width: el.offsetWidth
		});

		this.clearPlaceholder();
	}

	handleVisible(visible) {
		if (visible) {
			this.handleResize();
		}
	}

	render() {
		const {classes, loading, type, text, setSize} = this.props;
		const {height, width} = this.state;

		let style = {};

		if (height && width && setSize) {
			style = {height, width};
		}

		return (
			<button // eslint-disable-line react/button-has-type
				ref={ref.call(this, 'button')}
				type={type}
				className={classes}
				style={style}
			>
				{loading ? (
					<Loader wrapHeight={height} wrapWidth={width}/>
				) : null}
				{loading ? null : text}
			</button>
		);
	}
}
