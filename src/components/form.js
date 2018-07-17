import React, {Component} from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import {addUrlProps, UrlQueryParamTypes} from 'react-url-query';
import axios from 'axios';
import 'react-datepicker/dist/react-datepicker.css';

import {clickPrevent} from '../utils/componentHelpers';
import FormService from '../services/form';
import Text from './inputs/text';
import Textarea from './inputs/textarea';
import DatePicker from './inputs/date';
import Recaptcha from './inputs/recaptcha';
import Button from './button';
import CSS from '../css/modules/forms.module.scss';
import Loader from './loader';
import {innerHtml} from '../utils/wordpressHelpers';
import OptionGroup from './inputs/optionGroup';

const urlPropsQueryConfig = {
	campaignid: {
		type: UrlQueryParamTypes.string,
		queryParam: `campaignid`
	},
	adgroupid: {
		type: UrlQueryParamTypes.string,
		queryParam: `adgroupid`
	},
	// eslint-disable-next-line camelcase
	loc_interest_ms: {
		type: UrlQueryParamTypes.string,
		queryParam: `loc_interest_ms`
	},
	// eslint-disable-next-line camelcase
	loc_physical_ms: {
		type: UrlQueryParamTypes.string,
		queryParam: `loc_physical_ms`
	},
	matchtype: {
		type: UrlQueryParamTypes.string,
		queryParam: `matchtype`
	},
	device: {
		type: UrlQueryParamTypes.string,
		queryParam: `device`
	},
	devicemodel: {
		type: UrlQueryParamTypes.string,
		queryParam: `devicemodel`
	},
	keyword: {
		type: UrlQueryParamTypes.string,
		queryParam: `keyword`
	},
	placement: {
		type: UrlQueryParamTypes.string,
		queryParam: `placement`
	},
	adposition: {
		type: UrlQueryParamTypes.string,
		queryParam: `adposition`
	}
};

const mapUrlToProps = (parsedParams, props) => {
	return {
		...props,
		query: {
			...parsedParams
		}
	};
};

class Form extends Component {
	constructor(props) {
		super(props);

		this.state = {
			loading: false,
			sending: false,
			inputs: [],
			values: {},
			button: {},
			confirmation: null,
			errors: {},
			success: false,
			recaptcha: null,
			recaptchaError: null
		};

		this.form = null;

		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleRecaptcha = this.handleRecaptcha.bind(this);
		this.renderInput = this.renderInput.bind(this);
		this.renderForm = this.renderForm.bind(this);
		this.renderLoader = this.renderLoader.bind(this);
		this.renderConfirmation = this.renderConfirmation.bind(this);
		this.inputVisible = this.inputVisible.bind(this);
	}

	static propTypes = {
		formId: PropTypes.string.isRequired,
		query: PropTypes.object.isRequired,
		location: PropTypes.object.isRequired,
		classname: PropTypes.string
	};

	static defaultProps = {
		classname: 'default'
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
				console.error(`Error getting form ${this.props.formId}: ${err}`);
			});
	}

	getDefaultValues(fields) {
		const obj = {};

		fields.forEach(field => {
			let value;

			if (field.type === 'date') {
				value = moment();
			}

			if (field.type === 'checkbox') {
				value = '';
			}

			if (field.defaultValue === '{ip}') {
				this.getIpAddress(field.id);
			}

			obj[field.id] = value;

			this.form.setField(field.id, value);
		});

		// Get the query params and set them in the object
		const keys = Object.keys(this.props.query);

		keys.forEach(key => {
			const field = fields.find(f => f.inputName === key);

			if (field) {
				const value = this.props.query[key];
				obj[field.id] = value;
				this.form.setField(field.id, value);
			}
		});

		return obj;
	}

	getIpAddress(fieldId) {
		return axios.get('https://api.ipify.org?format=json').then(res => {
			const {ip} = res.data;
			this.form.setField(fieldId, ip);
			this.setState(prevState => {
				return {
					values: {
						...prevState.values,
						[fieldId]: ip
					}
				};
			});
		});
	}

	handleSubmit() {
		if (!this.state.recaptcha) {
			this.setState({
				recaptchaError: 'Please select the recaptchs'
			});
			return false;
		}

		this.setState({
			sending: true,
			confirmation: null,
			recaptchaError: null
		});

		this.form
			.submit()
			.then(res => {
				this.setState({
					sending: false,
					confirmation: res,
					success: true,
					errors: {}
				});
			})
			.catch(errors => {
				console.log(errors);
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

	handleRecaptcha(recaptcha) {
		this.setState({
			recaptcha,
			recaptchaError: null
		});
	}

	inputVisible(input) {
		if (!input || !input.conditionalLogic || !input.conditionalLogic.rules || !input.conditionalLogic.rules.length) {
			return true;
		}

		const {rules} = input.conditionalLogic;

		let visible = true;

		rules.forEach(rule => {
			const fieldId = parseInt(rule.fieldId, 10);
			const value = this.state.values[fieldId];
			const isset = value === rule.value;

			if (!isset) {
				visible = false;
			}
		});

		return visible;
	}

	render() {
		const {loading, success} = this.state;
		const {classname} = this.props;

		const wrapCss = [loading ? CSS.loading : CSS.wrap];

		if (CSS[classname]) {
			wrapCss.push(CSS[classname]);
		}

		return <div className={wrapCss.join(' ')}>{loading ? this.renderLoader() : success ? this.renderConfirmation() : this.renderForm()}</div>;
	}

	renderLoader() {
		return (
			<div className={CSS.loader} style={{height: 100}}>
				<Loader/>
			</div>
		);
	}

	renderForm() {
		const {inputs, button, sending, recaptchaError} = this.state;
		let count = 0;

		return (
			<form className={CSS.form} onSubmit={clickPrevent(this.handleSubmit)}>
				<ul>
					{inputs.map(input => {
						if (count !== 0) {
							count += 1;
						}

						if (!this.inputVisible(input)) {
							return null;
						}

						if (input.type === 'html') {
							return (
								<li
									key={input.id}
									// eslint-disable-next-line react/no-danger
									dangerouslySetInnerHTML={innerHtml(input.content)}
									className={CSS.full}
								/>
							);
						}

						const classes = [CSS.full];

						if (input.cssClass !== '') {
							const classList = input.cssClass.split(' ');
							classList.forEach(cl => {
								classes.push(CSS[cl]);
							});
						}

						if (input.type === 'hidden') {
							classes.push(CSS.hidden);
						}

						return (
							<li key={input.id} className={classes.join(' ')}>
								{this.renderInput(input, count)}
							</li>
						);
					})}
					<li className={CSS.captcha}>
						<Recaptcha onChange={this.handleRecaptcha} error={recaptchaError}/>
					</li>
					<li className={CSS.submit}>
						<Button type="submit" classes="btn btn-cta btn-cta-transparent-inverse" text={button.text} loading={sending}/>
					</li>
				</ul>
			</form>
		);
	}

	renderInput(input, index) {
		const {id, type, placeholder, label, required, inputName: name, choices, description} = input;
		const value = this.state.values[id];
		const error = this.state.errors[id];

		const props = {
			id: `${id}`,
			name: name !== '' || `gform_${id}`,
			type,
			tabIndex: index,
			placeholder: placeholder && placeholder !== '' ? placeholder : null,
			onChange: this.handleChange(id),
			required,
			value,
			error,
			choices,
			description,
			label: label && label !== '' && input.labelPlacement !== 'hidden_label' ? label : null
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
			return <Recaptcha tabIndex={index} onChange={this.handleChange(id)} error={error}/>;
		}

		if (type === 'hidden' && value) {
			return <input type="hidden" name={input.inputName} id={id} value={value}/>;
		}

		if (type === 'radio' || type === 'checkbox') {
			return <OptionGroup {...props}/>;
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

export default addUrlProps({urlPropsQueryConfig, mapUrlToProps})(Form);
