import React from 'react';
import PropTypes from 'prop-types';

import {key, input, noop} from '../../utils/componentHelpers';
import CSS from '../../css/modules/forms.module.scss';

const FileInput = ({
	classname,
	styles,
	type,
	name,
	id,
	value,
	onChange,
	autocomplete,
	placeholder,
	onKeyUp,
	onFocus,
	onBlur,
	readOnly,
	tabIndex,
	required,
	error,
	label,
	description
}) => {
	return (
		<div className={[CSS.inputGroup, CSS[classname]].join(' ')}>
			{label ? <label htmlFor={name}>{label}</label> : null}
			<input
				className={CSS.input}
				autoComplete={autocomplete}
				style={styles || null}
				type={type}
				required={required ? 'true' : 'false'}
				id={id || null}
				name={name || null}
				value={value || ''}
				readOnly={readOnly ? 'readonly' : ''}
				tabIndex={tabIndex}
				placeholder={placeholder ? placeholder : null}
				onChange={input(onChange)}
				onKeyUp={key(onKeyUp)}
				onFocus={onFocus || null}
				onBlur={onBlur || null}
			/>
			{description && description !== '' ? (
				<small className={CSS.description}>{description}</small>
			) : null}
			{error && error !== '' ? (
				<small className={CSS.error}>{error}</small>
			) : null}
		</div>
	);
};

FileInput.propTypes = {
	type: PropTypes.string,
	value: PropTypes.string,
	onChange: PropTypes.func,
	name: PropTypes.string,
	id: PropTypes.string,
	placeholder: PropTypes.string,
	onKeyUp: PropTypes.func,
	readOnly: PropTypes.bool,
	autocomplete: PropTypes.string,
	classname: PropTypes.string,
	styles: PropTypes.object,
	onFocus: PropTypes.func,
	onBlur: PropTypes.func,
	tabIndex: PropTypes.number,
	required: PropTypes.bool,
	error: PropTypes.string,
	label: PropTypes.string,
	description: PropTypes.string
};

FileInput.defaultProps = {
	type: 'text',
	value: '',
	name: null,
	id: null,
	placeholder: 'Text Box',
	readOnly: false,
	autocomplete: 'on',
	classname: '',
	styles: {},
	tabIndex: 1,
	onChange: noop,
	onKeyUp: noop,
	onFocus: noop,
	onBlur: noop,
	required: false,
	error: null,
	label: null,
	description: null
};

export default FileInput;
