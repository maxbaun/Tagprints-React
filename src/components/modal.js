import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Motion, spring, presets} from 'react-motion';

import CSS from '../css/modules/modal.module.scss';

export default class Modal extends Component {
	constructor(props) {
		super(props);

		this.state = {
			visibility: 'hidden',
			display: 'none',
			windowHeight: 0,
			active: props.active
		};

		this.handleRest = this.handleRest.bind(this);
		this.handleClose = this.handleClose.bind(this);
		this.handleResize = this.handleResize.bind(this);
	}

	static propTypes = {
		active: PropTypes.bool,
		onClose: PropTypes.func,
		onShow: PropTypes.func,
		children: PropTypes.node,
		size: PropTypes.string,
		showClose: PropTypes.bool,
		classname: PropTypes.string,
		fogOpacity: PropTypes.number
	};

	static defaultProps = {
		active: false,
		onClose: () => {},
		onShow: () => {},
		children: null,
		size: null,
		showClose: false,
		classname: '',
		fogOpacity: 0.5
	};

	componentDidMount() {
		this.handleResize();
		window.addEventListener('resize', this.handleResize);
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.handleResize);
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.active) {
			this.setState({
				visibility: 'visible',
				display: 'block',
				active: true
			});

			this.handleResize();

			document.querySelector('body').style.overflow = 'hidden';
		}

		if (nextProps.active === false) {
			this.setState({
				active: false
			});

			this.handleResize();

			document.querySelector('body').style.overflow = null;
		}
	}

	handleRest() {
		const {active} = this.state;

		if (!active) {
			return this.setState({
				visibility: 'hidden',
				display: 'none'
			});
		}

		return this.props.onShow();
	}

	handleClose() {
		document.querySelector('body').style.overflow = null;
		this.props.onClose();
	}

	handleResize() {
		this.setState({
			windowHeight: document.body.clientHeight
		});
	}

	render() {
		const {children, size, showClose, classname, fogOpacity} = this.props;
		const {visibility, windowHeight, display, active} = this.state;

		const wrapClass = [CSS.wrap, classname && classname !== '' ? CSS[classname] : ''];
		const modalClass = [CSS.modal, size ? CSS[size] : ''];

		return (
			<div className={wrapClass.join(' ')} style={{visibility}}>
				{showClose ? (
					<span onClick={this.handleClose} className={CSS.close}>
						<span className="fa fa-close"/>
					</span>
				) : null}
				<Motion
					defaultStyle={{
						opacity: 0,
						x: 0.8,
						y: 0.8,
						top: 4
					}}
					style={{
						opacity: active ? spring(1, presets.stiff) : spring(0, presets.stiff),
						x: active ? spring(1, presets.stiff) : spring(0.8, presets.stiff),
						y: active ? spring(1, presets.stiff) : spring(0.8, presets.stiff),
						top: active ? spring(10, presets.stiff) : spring(4, presets.stiff)
					}}
					onRest={this.handleRest}
				>
					{styles => {
						const height = windowHeight - windowHeight / 5;

						return (
							<div
								className={modalClass.join(' ')}
								style={{
									height: size === 'full' ? height : 'auto',
									visibility: visibility,
									display: display,
									opacity: styles.opacity,
									top: `${styles.top}%`,
									zIndex: active ? 1003 : 1000,
									transform: `scaleX(${styles.x}) scaleY(${styles.y})`
								}}
							>
								{children}
							</div>
						);
					}}
				</Motion>
				<Motion
					defaultStyle={{
						opacity: 0
					}}
					style={{
						opacity: active ? spring(fogOpacity, presets.stiff) : spring(0, presets.stiff)
					}}
				>
					{styles => {
						return (
							<div
								onClick={this.handleClose}
								className={CSS.fog}
								style={{
									visibility: visibility,
									opacity: styles.opacity,
									zIndex: active ? 1002 : 999
								}}
							/>
						);
					}}
				</Motion>
			</div>
		);
	}
}
