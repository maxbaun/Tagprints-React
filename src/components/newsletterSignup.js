import React, {Component} from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

import CSS from '../css/modules/newsletterSignup.module.scss';
import Text from './inputs/text';
import Button from './button';
import Constants from '../constants';

export default class NewsletterSignup extends Component {
	constructor(props) {
		super(props);

		this.state = {
			loading: false,
			email: '',
			error: null,
			message: null
		};

		this.handleSubmit = this.handleSubmit.bind(this);
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

	handleSubmit(e) {
		e.preventDefault();
		const {email} = this.state;

		this.setState({
			message: null
		});

		if (!email || email === '') {
			this.setState({
				message: 'Please enter an email.'
			});

			return;
		}

		this.setState({
			loading: true,
			error: null
		});

		axios({
			url: `${Constants.mailchimpUrl}/v1/list/user`,
			method: 'post',
			data: {
				email,
				apiKey: Constants.mailchimpApiKey,
				listId: this.props.list,
				region: 'us7'
			}
		}).then(() => {
			this.setState({
				loading: false,
				message: 'Thank you for subscribing!'
			});
		}).catch(err => {
			this.setState({
				loading: false,
				message: err.response.data.message
			});
		});
	}

	handleChange(email) {
		this.setState({email});
	}

	render() {
		const {text, btnClass, loaderColor} = this.props;
		const {message} = this.state;

		return (
			<div className={CSS.wrap}>
				<div className={CSS.text}>{text}</div>
				<form onSubmit={this.handleSubmit} className={CSS.form}>
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
						onClick={this.handleSubmit}
					/>
					{message ? <small className={CSS.message}>{this.state.message}</small> : null}
				</form>
			</div>
		);
	}
}
