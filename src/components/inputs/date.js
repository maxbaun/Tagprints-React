import React from 'react';
import PropTypes from 'prop-types';
import DatePicker from 'react-datepicker';

import {key, input, noop} from '../../utils/componentHelpers';
import CSS from '../../css/modules/forms.module.scss';

const Datepicker = ({
	classname,
	name,
	id,
	value,
	onChange,
	autocomplete,
	placeholder,
	onFocus,
	onBlur,
	readOnly,
	tabIndex,
	required,
	error
}) => {
	const extraProps = {};

	if (required) {
		extraProps.required = 'true';
	}

	return (
		<div className={[CSS.inputGroup, CSS[classname]].join(' ')}>
			<DatePicker
				className={CSS.input}
				onChange={onChange}
				selected={value}
				autoComplete={autocomplete}
				id={id || null}
				name={name || null}
				readOnly={readOnly}
				tabIndex={tabIndex}
				placeholderText={placeholder}
				onFocus={onFocus || null}
				onBlur={onBlur || null}
				{...extraProps}
			/>
			{error && error !== '' ? (
				<small className={CSS.error}>{error}</small>
			) : null}
		</div>
	);
};

Datepicker.propTypes = {
	value: PropTypes.object,
	onChange: PropTypes.func,
	name: PropTypes.string,
	id: PropTypes.string,
	placeholder: PropTypes.string,
	readOnly: PropTypes.bool,
	autocomplete: PropTypes.string,
	classname: PropTypes.string,
	onFocus: PropTypes.func,
	onBlur: PropTypes.func,
	tabIndex: PropTypes.number,
	required: PropTypes.bool,
	error: PropTypes.string
};

Datepicker.defaultProps = {
	value: {},
	name: null,
	id: null,
	placeholder: 'Text Box',
	readOnly: false,
	autocomplete: 'on',
	classname: '',
	tabIndex: 1,
	onChange: noop,
	onFocus: noop,
	onBlur: noop,
	required: false,
	error: null
};

export default Datepicker;
