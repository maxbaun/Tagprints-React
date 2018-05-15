import axios from 'axios';
import {HmacSHA1, enc} from 'crypto-js';

import {gfBase, gfPublicKey, gfPrivateKey} from '../constants';

export default class Form {
	constructor(formId) {
		this.formId = formId;
		this.form = {};
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
				const {data} = res;

				if (data.status !== 200) {
					return reject(data.response);
				}

				this.form = data.response;
				return resolve(this.form);
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
