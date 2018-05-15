import React, {Component} from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';

import {state, click, clickPrevent} from '../utils/componentHelpers';
import FormService from '../services/form';
import Text from './inputs/text';
import Textarea from './inputs/textarea';
import DatePicker from './inputs/date';
import Recaptcha from './inputs/recaptcha';
import CSS from '../css/modules/forms.module.scss';

export default class Form extends Component {
	constructor(props) {
		super(props);

		this.state = {
			loading: false,
			sending: false,
			inputs: [],
			values: {},
			button: {},
			hasCaptcha: false,
			captchaFields: []
		};

		this.form = null;

		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.getValue = this.getValue.bind(this);
		this.renderInput = this.renderInput.bind(this);
	}

	static propTypes = {
		formId: PropTypes.string.isRequired
	};

	componentDidMount() {
		this.setState({loading: true});
		this.form = new FormService(this.props.formId);

		this.form
			.getForm()
			.then(res => {
				console.log(res);
				const captchaFields = res.fields
					.filter(f => f.type === 'captcha')
					.map(f => f.id);
				const hasCaptcha = Boolean(captchaFields.length);

				this.setState({
					loading: false,
					inputs: res.fields,
					button: res.button,
					hasCaptcha,
					captchaFields
				});
			})
			.catch(err => {
				console.error(
					`Error getting form ${this.props.formId}: ${err}`
				);
			});
	}

	getValue(id) {
		return this.state.values[id];
	}

	formValid() {
		const {inputs, values} = this.state;

		let valid = true;

		inputs.forEach(input => {
			if (input.required && !values[input]) {
				valid = false;
			}
		});

		if (this.state.hasCaptcha && this.state.captchaFields) {
			this.state.captchaFields.forEach(id => {
				if (!values[id]) {
					valid = false;
				}
			});
		}

		return valid;
	}

	transformValues() {
		const keys = Object.keys(this.state.values);
		const obj = {};

		keys.forEach(key => {
			let value = this.state.values[key];

			if (moment.isMoment(value)) {
				value = value.format('MM/DD/YYYY').toString();
			}

			obj[key] = value;
		});

		return obj;
	}

	handleSubmit() {
		if (this.formValid()) {
			const values = this.transformValues();
			// @TODO - submit the form
			console.log('form submitted');
			console.log(values);
		}
	}

	handleChange(id) {
		return value => {
			this.setState(prevState => {
				return {
					...prevState,
					values: {
						...prevState.values,
						[id]: value
					}
				};
			});
		};
	}

	render() {
		const {inputs, button} = this.state;
		let count = 0;

		return (
			<div className={CSS.wrap}>
				<form
					className={CSS.form}
					onSubmit={clickPrevent(this.handleSubmit)}
				>
					<ul>
						{inputs.map(input => {
							if (input.type === 'html') {
								return null;
							}

							if (count !== 0) {
								count += 1;
							}

							const classes = [];

							if (input.cssClass !== '') {
								classes.push(CSS[input.cssClass]);
							}

							if (input.type === 'hidden') {
								classes.push(CSS.hidden);
							}

							if (classes.length === 0) {
								classes.push(CSS.full);
							}

							return (
								<li
									key={input.id}
									className={classes.join(' ')}
								>
									{this.renderInput(input, count)}
								</li>
							);
						})}
						<li className={CSS.submit}>
							<button
								type="submit"
								className="btn btn-cta btn-cta-transparent-inverse"
							>
								{button.text}
							</button>
						</li>
					</ul>
				</form>
			</div>
		);
	}

	renderInput(input, index) {
		const props = {
			id: `${input.id}`,
			name: `gform_${input.id}`,
			type: input.type,
			tabIndex: index,
			placeholder: input.label,
			onChange: this.handleChange(input.id),
			required: input.required,
			value: this.getValue(input.id)
		};

		if (input.type === 'text' || input.type === 'email') {
			return <Text {...props}/>;
		}

		if (input.type === 'textarea') {
			return <Textarea {...props}/>;
		}

		if (input.type === 'date') {
			return (
				<DatePicker
					{...props}
					value={this.getValue(input.id) || moment()}
				/>
			);
		}

		if (input.type === 'captcha') {
			return (
				<Recaptcha
					tabIndex={index}
					onChange={this.handleChange(input.id)}
				/>
			);
		}
	}
}
