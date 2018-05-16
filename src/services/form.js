import axios from 'axios';
import moment from 'moment';
import {HmacSHA1, enc} from 'crypto-js';

import {gfBase, gfPublicKey, gfPrivateKey} from '../constants';
import {replaceLinks} from '../utils/wordpressHelpers';

export default class Form {
	constructor(formId) {
		this.formId = formId;
		this.form = {};
		this.fields = [];
		this.values = {};
		this.hasCaptcha = false;
	}

	getForm() {
		return new Promise((resolve, reject) => {
			const d = parseInt(new Date().getTime() / 1000, 10);
			const expires = d + 3600; // Expires in one hour
			const method = 'GET';
			const url = `forms/${this.formId}`;
			const signature = this.getSignature(method, url, expires);

			axios({
				method,
				baseURL: gfBase,
				url,
				params: {
					api_key: gfPublicKey, // eslint-disable-line camelcase
					signature,
					expires
				}
			}).then(res => {
				const {response, status} = res.data;

				if (status !== 200) {
					return reject(response);
				}

				const {fields} = response;

				this.fields = fields;
				this.hasCaptcha = Boolean(this.getCaptchaFields(fields).length);

				return resolve(response);
			});
		});
	}

	getCaptchaFields(fields) {
		if (!fields) {
			return [];
		}

		return fields.filter(f => f.type === 'captcha').map(f => f.id);
	}

	setField(field, value) {
		this.values[field] = value;

		return this.values;
	}

	isValid() {
		const {fields, values, hasCaptcha} = this;

		let valid = true;

		fields.forEach(field => {
			if (field.required && !values[field]) {
				valid = false;
			}
		});

		const captchaFields = this.getCaptchaFields(fields);

		if (hasCaptcha && captchaFields) {
			captchaFields.forEach(id => {
				if (!values[id]) {
					valid = false;
				}
			});
		}

		return valid;
	}

	transformValues() {
		const keys = Object.keys(this.values);
		const obj = {};

		keys.forEach(key => {
			let value = this.values[key];

			if (moment.isMoment(value)) {
				value = value.format('MM/DD/YYYY').toString();
			}

			obj[`input_${key}`] = value;
		});

		return obj;
	}

	submit() {
		return new Promise((resolve, reject) => {
			// If (!this.isValid()) {
			// 	return reject(new Error('Form not valid'));
			// }
			const values = this.transformValues();

			const d = parseInt(new Date().getTime() / 1000, 10);
			const expires = d + 3600; // Expires in one hour
			const method = 'POST';
			const url = `forms/${this.formId}/submissions`;
			const signature = this.getSignature(method, url, expires);

			const data = {
				// eslint-disable-next-line camelcase
				input_values: {
					...values,
					[`gform_submit`]: '1',
					[`gform_target_page_number_${this.formId}`]: '1',
					[`gform_source_page_number_${this.formId}`]: '1'
				}
			};

			axios({
				method,
				baseURL: gfBase,
				url,
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				data: JSON.stringify(data),
				params: {
					api_key: gfPublicKey, // eslint-disable-line camelcase
					signature,
					expires
				}
			}).then(res => {
				const {response} = res.data;

				if (!response.is_valid && response.validation_messages) {
					return reject(response.validation_messages);
				}

				if (response.confirmation_redirect) {
					window.location.href = replaceLinks(
						response.confirmation_redirect
					);
					return;
				}

				return resolve(response.confirmation_message);
			});
		});
	}

	getSignature(method, route, expires) {
		const str = `${gfPublicKey}:${method}:${route}:${expires}`;

		const hash = HmacSHA1(str, gfPrivateKey);
		const base64 = hash.toString(enc.Base64);

		return encodeURIComponent(base64);
	}
}
