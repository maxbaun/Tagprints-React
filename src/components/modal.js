import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Motion, spring, presets} from 'react-motion';

import CSS from '../css/modules/modal.module.scss';

export default class Modal extends Component {
	constructor(props) {
		super(props);

		this.state = {
			visibility: 'hidden'
		};

		this.handleRest = this.handleRest.bind(this);
		this.handleClose = this.handleClose.bind(this);
	}

	static propTypes = {
		active: PropTypes.bool,
		onClose: PropTypes.func,
		onShow: PropTypes.func,
		children: PropTypes.node,
		size: PropTypes.string,
		showClose: PropTypes.bool
	};

	static defaultProps = {
		active: false,
		onClose: () => {},
		onShow: () => {},
		children: null,
		size: null,
		showClose: false
	};

	componentWillReceiveProps(nextProps) {
		if (nextProps.active) {
			this.setState({
				visibility: 'visible'
			});

			document.querySelector('body').style.overflow = 'hidden';
		}
	}

	handleRest() {
		const {active} = this.props;

		if (!active) {
			return this.setState({
				visibility: 'hidden'
			});
		}

		return this.props.onShow();
	}

	handleClose() {
		document.querySelector('body').style.overflow = null;
		this.props.onClose();
	}

	render() {
		const {active, children, size, showClose} = this.props;
		const {visibility} = this.state;

		const modalClass = [CSS.modal, size ? CSS[size] : ''];

		return (
			<div className={CSS.wrap}>
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
						opacity: active ?
							spring(1, presets.stiff) :
							spring(0, presets.stiff),
						x: active ?
							spring(1, presets.stiff) :
							spring(0.8, presets.stiff),
						y: active ?
							spring(1, presets.stiff) :
							spring(0.8, presets.stiff),
						top: active ?
							spring(10, presets.stiff) :
							spring(4, presets.stiff)
					}}
					onRest={this.handleRest}
				>
					{styles => {
						return (
							<div
								className={modalClass.join(' ')}
								style={{
									visibility: visibility,
									opacity: styles.opacity,
									top: `${styles.top}%`,
									zIndex: active ? 1003 : 1000,
									transform: `scaleX(${styles.x}) scaleY(${
										styles.y
									})`
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
						opacity: active ?
							spring(0.5, presets.stiff) :
							spring(0, presets.stiff)
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
