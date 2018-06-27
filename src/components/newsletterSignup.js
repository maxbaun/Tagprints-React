import React, {Component} from 'react';
import PropTypes from 'prop-types';

import CSS from '../css/modules/newsletterSignup.module.scss';
import Text from './inputs/text';
import Button from './button';

export default class NewsletterSignup extends Component {
	constructor(props) {
		super(props);

		this.state = {
			loading: false,
			email: ''
		};

		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}

	static propTypes = {
		text: PropTypes.string,
		btnClass: PropTypes.string,
		loaderColor: PropTypes.string
	};

	static defaultProps = {
		text: null,
		btnClass: 'btn btn-primary',
		loaderColor: '#f15a24'
	};

	handleSubmit(e) {
		e.preventDefault();
		console.log(this.state.email);
		this.setState({
			loading: true
		});
	}

	handleChange(email) {
		this.setState({email});
	}

	render() {
		const {text, btnClass, loaderColor} = this.props;

		return (
			<div className={CSS.wrap}>
				<div className={CSS.text}>{text}</div>
				<form onSubmit={this.handleSubmit} className={CSS.form}>
					<Text type="email" placeholder="Your E-Mail" onChange={this.handleChange} value={this.state.email}/>
					<Button
						onClick={this.handleSubmit}
						classes={`${btnClass} ${CSS.button}`}
						type="submit"
						text="Submit"
						loading={this.state.loading}
						loaderColor={loaderColor}
					/>
				</form>
			</div>
		);
	}
}
