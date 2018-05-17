import React from 'react';
import PropTypes from 'prop-types';

import {input, noop} from '../../utils/componentHelpers';
import CSS from '../../css/modules/forms.module.scss';

const OptionGroup = ({
	classname,
	name,
	value,
	onChange,
	tabIndex,
	required,
	error,
	label,
	choices,
	type
}) => {
	return (
		<div className={[CSS.inputGroup, CSS[classname]].join(' ')}>
			{label ? <label htmlFor={name}>{label}</label> : null}
			<ul
				className={[CSS.optionGroup, CSS[`optionGroup${type}`]].join(
					' '
				)}
			>
				{choices &&
					choices.map(choice => {
						let checked = false;

						if (
							type === 'checkbox' &&
							value.includes(choice.value)
						) {
							checked = true;
						}

						if (type === 'radio' && value === choice.value) {
							checked = true;
						}

						return (
							<li key={choice.value}>
								<label>
									<input
										type={type}
										required={required}
										tabIndex={tabIndex}
										className={CSS.option}
										value={choice.value}
										name={name}
										checked={checked}
										onClick={input(onChange)}
									/>
									{choice.text}
								</label>
							</li>
						);
					})}
			</ul>
			{error && error !== '' ? (
				<small className={CSS.error}>{error}</small>
			) : null}
		</div>
	);
};

OptionGroup.propTypes = {
	value: PropTypes.string,
	onChange: PropTypes.func,
	name: PropTypes.string,
	placeholder: PropTypes.string,
	classname: PropTypes.string,
	tabIndex: PropTypes.number,
	required: PropTypes.bool,
	error: PropTypes.string,
	label: PropTypes.string,
	choices: PropTypes.array,
	type: PropTypes.string
};

OptionGroup.defaultProps = {
	value: '',
	name: null,
	placeholder: 'Text Box',
	classname: '',
	tabIndex: 1,
	onChange: noop,
	required: false,
	error: null,
	label: null,
	choices: [],
	type: 'radio'
};

export default OptionGroup;
