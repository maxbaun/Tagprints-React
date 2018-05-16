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
import Button from './button';
import CSS from '../css/modules/forms.module.scss';
import Loader from './loader';
import {innerHtml} from '../utils/wordpressHelpers';

export default class Form extends Component {
	constructor(props) {
		super(props);

		this.state = {
			loading: false,
			sending: false,
			inputs: [],
			values: {},
			button: {},
			confirmation: null,
			errors: {}
		};

		this.form = null;

		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.renderInput = this.renderInput.bind(this);
		this.renderForm = this.renderForm.bind(this);
		this.renderLoader = this.renderLoader.bind(this);
		this.renderConfirmation = this.renderConfirmation.bind(this);
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
				this.setState({
					loading: false,
					inputs: res.fields,
					button: res.button,
					errors: {},
					values: this.getDefaultValues(res.fields)
				});
			})
			.catch(err => {
				console.error(
					`Error getting form ${this.props.formId}: ${err}`
				);
			});
	}

	getDefaultValues(fields) {
		const obj = {};

		fields.forEach(field => {
			let value;

			if (field.type === 'date') {
				value = moment();
			}

			obj[field.id] = value;

			this.form.setField(field.id, value);
		});

		return obj;
	}

	handleSubmit() {
		this.setState({
			sending: true,
			confirmation: null
		});

		this.form
			.submit()
			.then(res => {
				this.setState({
					sending: false,
					confirmation: res,
					errors: {}
				});
			})
			.catch(errors => {
				this.setState({
					sending: false,
					errors
				});
			});
	}

	handleChange(id) {
		return value => {
			this.setState(prevState => {
				return {
					...prevState,
					values: this.form.setField(id, value)
				};
			});
		};
	}

	render() {
		const {loading} = this.state;

		return (
			<div className={loading ? CSS.loading : CSS.wrap}>
				{loading ? this.renderLoader() : this.renderForm()}
			</div>
		);
	}

	renderLoader() {
		return (
			<div className={CSS.loader} style={{height: 100}}>
				<Loader/>
			</div>
		);
	}

	renderForm() {
		const {inputs, button, sending} = this.state;
		let count = 0;

		return (
			<form
				className={CSS.form}
				onSubmit={clickPrevent(this.handleSubmit)}
			>
				{this.renderConfirmation()}
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
							<li key={input.id} className={classes.join(' ')}>
								{this.renderInput(input, count)}
							</li>
						);
					})}
					<li className={CSS.submit}>
						<Button
							setSize
							type="submit"
							classes="btn btn-cta btn-cta-transparent-inverse"
							text={button.text}
							loading={sending}
						/>
					</li>
				</ul>
			</form>
		);
	}

	renderInput(input, index) {
		const {id, type} = input;
		const value = this.state.values[id];
		const error = this.state.errors[id];

		const props = {
			id: `${id}`,
			name: `gform_${id}`,
			type,
			tabIndex: index,
			placeholder: input.label,
			onChange: this.handleChange(id),
			required: input.required,
			value,
			error
		};

		if (type === 'text' || type === 'email') {
			return <Text {...props}/>;
		}

		if (type === 'textarea') {
			return <Textarea {...props}/>;
		}

		if (type === 'date') {
			return <DatePicker {...props} value={value || moment()}/>;
		}

		if (type === 'captcha') {
			return (
				<Recaptcha
					tabIndex={index}
					onChange={this.handleChange(id)}
					error={error}
				/>
			);
		}
	}

	renderConfirmation() {
		const {confirmation} = this.state;

		if (!confirmation || confirmation === '') {
			return null;
		}

		return (
			<div
				dangerouslySetInnerHTML={innerHtml(confirmation)} // eslint-disable-line react/no-danger
				className={CSS.confirmation}
			/>
		);
	}
}
