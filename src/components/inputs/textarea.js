import React from 'react';
import PropTypes from 'prop-types';

import {key, input, noop} from '../../utils/componentHelpers';
import CSS from '../../css/modules/forms.module.scss';

const TextArea = ({
	classname,
	styles,
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
	error
}) => {
	return (
		<div className={[CSS.inputGroup, CSS[classname]].join(' ')}>
			<textarea
				className={CSS.input}
				autoComplete={autocomplete}
				style={styles || null}
				required={required ? 'true' : 'false'}
				id={id || null}
				name={name || null}
				value={value || ''}
				readOnly={readOnly ? 'readonly' : ''}
				tabIndex={tabIndex}
				placeholder={placeholder}
				onChange={input(onChange)}
				onKeyUp={key(onKeyUp)}
				onFocus={onFocus || null}
				onBlur={onBlur || null}
			/>
			{error && error !== '' ? (
				<small className={CSS.error}>{error}</small>
			) : null}
		</div>
	);
};

TextArea.propTypes = {
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
	error: PropTypes.string
};

TextArea.defaultProps = {
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
	error: null
};

export default TextArea;