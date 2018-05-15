import React from 'react';
import PropTypes from 'prop-types';
import ReCAPTCHA from 'react-google-recaptcha';

import {noop} from '../../utils/componentHelpers';
import {recaptchaKey} from '../../constants';
import CSS from '../../css/modules/forms.module.scss';

const RecaptchaInput = ({classname, styles, onChange, tabIndex}) => {
	return (
		<div
			className={[CSS.inputGroup, CSS[classname]].join(' ')}
			style={styles}
		>
			<ReCAPTCHA
				sitekey={recaptchaKey}
				onChange={onChange}
				tabindex={tabIndex}
			/>
		</div>
	);
};

RecaptchaInput.propTypes = {
	onChange: PropTypes.func,
	classname: PropTypes.string,
	styles: PropTypes.object,
	tabIndex: PropTypes.number
};

RecaptchaInput.defaultProps = {
	classname: '',
	styles: {},
	tabIndex: 1,
	onChange: noop
};

export default RecaptchaInput;
