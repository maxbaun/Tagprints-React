import React, {Component} from 'react';
import PropTypes from 'prop-types';

import CSS from '../css/modules/newsletterSignup.module.scss';
import Text from './inputs/text';
import Button from './button';
// Import Constants from '../constants';

export default class NewsletterSignup extends Component {
	constructor(props) {
		super(props);

		this.state = {
			loading: false,
			email: '',
			error: null,
			message: null
		};

		// This.handleSubmit = this.handleSubmit.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}

	static propTypes = {
		text: PropTypes.string,
		btnClass: PropTypes.string,
		loaderColor: PropTypes.string,
		list: PropTypes.string
	};

	static defaultProps = {
		text: null,
		btnClass: 'btn btn-primary',
		loaderColor: '#f15a24',
		list: '477fc0d8e2'
	};

	// HandleSubmit(e) {
	// 	e.preventDefault();
	// 	const {email} = this.state;

	// 	this.setState({
	// 		message: null
	// 	});

	// 	if (!email) {
	// 		this.setState({
	// 			error: 'Please enter an email.'
	// 		});

	// 		return;
	// 	}

	// 	this.setState({
	// 		loading: true,
	// 		error: null
	// 	});

	// 	const headers = {};
	// 	headers.Authorization = `apikey ${Constants.mailchimpApiKey}`;
	// 	headers['content-type'] = 'application/json';

	// 	const params = toQuerystring({
	// 		email_address: email, // eslint-disable-line camelcase
	// 		status: 'subscribed',
	// 		apikey: Constants.mailchimpApiKey
	// 	});
	// }

	handleChange(email) {
		this.setState({email});
	}

	render() {
		const {text, btnClass, loaderColor} = this.props;
		const {message} = this.state;

		return (
			<div className={CSS.wrap}>
				<div className={CSS.text}>{text}</div>
				<form action="https://d3applications.us7.list-manage.com/subscribe/post" className={CSS.form}>
					<input type="hidden" name="u" value="a32be5f488708e694aa6c18ae"/>
					<input type="hidden" name="id" value="477fc0d8e2"/>
					<Text
						type="email"
						error={this.state.error}
						placeholder="Your E-Mail"
						name="EMAIL"
						onChange={this.handleChange}
						value={this.state.email}
					/>
					<Button
						classes={`${btnClass} ${CSS.button}`}
						type="submit"
						text="Submit"
						loading={this.state.loading}
						loaderColor={loaderColor}
					/>
					{message ? <small className={CSS.message}>{this.state.message}</small> : null}
				</form>
			</div>
		);
	}
}
