import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ReCAPTCHA from 'react-google-recaptcha';
import {HmacSHA1} from 'crypto-js';

import {noop} from '../../utils/componentHelpers';
import {recaptchaKey} from '../../constants';
import CSS from '../../css/modules/forms.module.scss';

export default class RecaptchaInput extends Component {
	constructor(props) {
		super(props);

		this.state = {
			active: false
		};
	}

	static propTypes = {
		onChange: PropTypes.func,
		classname: PropTypes.string,
		styles: PropTypes.object,
		tabIndex: PropTypes.number,
		error: PropTypes.string
	};

	static defaultProps = {
		classname: '',
		styles: {},
		tabIndex: 1,
		onChange: noop,
		error: null
	};

	componentDidMount() {
		this.setState({active: true});
	}

	render() {
		const {classname, styles, onChange, tabIndex, error} = this.props;
		const {active} = this.state;

		if (!active) {
			return null;
		}

		return (
			<div className={[CSS.inputGroup, CSS[classname]].join(' ')} style={styles}>
				<ReCAPTCHA sitekey={recaptchaKey} onChange={onChange} tabindex={tabIndex}/>
				{error && error !== '' ? <small className={CSS.error}>{error}</small> : null}
			</div>
		);
	}
}
