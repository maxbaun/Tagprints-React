import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {ref} from '../utils/componentHelpers';

export default class Loader extends Component {
	constructor(props) {
		super(props);

		this.wrap = null;
	}

	static propTypes = {
		color: PropTypes.string,
		width: PropTypes.number,
		hCenter: PropTypes.bool,
		vCenter: PropTypes.bool,
		zIndex: PropTypes.number,
		setParent: PropTypes.bool
	};

	static defaultProps = {
		color: '#f15a24',
		width: 50,
		hCenter: true,
		vCenter: true,
		zIndex: 9,
		setParent: true
	};

	componentDidMount() {
		if (this.props.setParent) {
			this.setParentStyles();
		}
	}

	componentWillUnmount() {
		if (this.props.setParent) {
			this.removeParentStyles();
		}
	}

	setParentStyles() {
		const parent = this.wrap.parentNode;

		parent.style.position = 'relative';
	}

	removeParentStyles() {
		const parent = this.wrap.parentNode;

		parent.style.position = null;
	}

	render() {
		const {color, width, hCenter, vCenter, zIndex} = this.props;

		let wrapStyle = {
			position: 'absolute',
			left: 0,
			top: 0,
			width: '100%',
			height: '100%',
			zIndex
		};

		let loaderStyle = {};

		if (hCenter) {
			wrapStyle = {
				...wrapStyle,
				textAlign: 'center'
			};
		}

		if (vCenter) {
			wrapStyle = {
				...wrapStyle,
				display: 'table'
			};

			loaderStyle = {
				display: 'table-cell',
				verticalAlign: 'middle'
			};
		}
		return (
			<div ref={ref.call(this, 'wrap')} style={wrapStyle}>
				<div style={loaderStyle}>
					<svg
						width={width}
						height={width / 4}
						viewBox="0 0 120 30"
						xmlns="http://www.w3.org/2000/svg"
						fill={color}
					>
						<circle cx="15" cy="15" r="15">
							<animate
								attributeName="r"
								from="15"
								to="15"
								begin="0s"
								dur="0.8s"
								values="15;9;15"
								calcMode="linear"
								repeatCount="indefinite"
							/>
							<animate
								attributeName="fill-opacity"
								from="1"
								to="1"
								begin="0s"
								dur="0.8s"
								values="1;.5;1"
								calcMode="linear"
								repeatCount="indefinite"
							/>
						</circle>
						<circle cx="60" cy="15" r="9" fillOpacity="0.3">
							<animate
								attributeName="r"
								from="9"
								to="9"
								begin="0s"
								dur="0.8s"
								values="9;15;9"
								calcMode="linear"
								repeatCount="indefinite"
							/>
							<animate
								attributeName="fill-opacity"
								from="0.5"
								to="0.5"
								begin="0s"
								dur="0.8s"
								values=".5;1;.5"
								calcMode="linear"
								repeatCount="indefinite"
							/>
						</circle>
						<circle cx="105" cy="15" r="15">
							<animate
								attributeName="r"
								from="15"
								to="15"
								begin="0s"
								dur="0.8s"
								values="15;9;15"
								calcMode="linear"
								repeatCount="indefinite"
							/>
							<animate
								attributeName="fill-opacity"
								from="1"
								to="1"
								begin="0s"
								dur="0.8s"
								values="1;.5;1"
								calcMode="linear"
								repeatCount="indefinite"
							/>
						</circle>
					</svg>
				</div>
			</div>
		);
	}
}
