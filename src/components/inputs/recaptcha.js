import React from 'react';
import PropTypes from 'prop-types';
import ReCAPTCHA from 'react-google-recaptcha';
import {HmacSHA1} from 'crypto-js';

import {noop} from '../../utils/componentHelpers';
import {recaptchaKey} from '../../constants';
import CSS from '../../css/modules/forms.module.scss';

const RecaptchaInput = ({classname, styles, onChange, tabIndex, error}) => {
	return (
		<div className={[CSS.inputGroup, CSS[classname]].join(' ')} style={styles}>
			<ReCAPTCHA sitekey={recaptchaKey} onChange={onChange} tabindex={tabIndex}/>
			{error && error !== '' ? <small className={CSS.error}>{error}</small> : null}
		</div>
	);
};

RecaptchaInput.propTypes = {
	onChange: PropTypes.func,
	classname: PropTypes.string,
	styles: PropTypes.object,
	tabIndex: PropTypes.number,
	error: PropTypes.string
};

RecaptchaInput.defaultProps = {
	classname: '',
	styles: {},
	tabIndex: 1,
	onChange: noop,
	error: null
};

export default RecaptchaInput;
