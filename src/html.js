import React from 'react';
import PropTypes from 'prop-types';

import './utils/fragments';

let stylesStr;

if (process.env.NODE_ENV === `production`) {
	try {
		stylesStr = require(`!raw-loader!../public/styles.css`);
	} catch (e) {
		console.log(e);
	}
}

export default class Html extends React.Component {
	static propTypes = {
		headComponents: PropTypes.node.isRequired,
		body: PropTypes.node.isRequired,
		postBodyComponents: PropTypes.node.isRequired
	};

	componentDidMount() {
		window.vs_account_id = 'fwABAVssGPNPYgDM'; // eslint-disable-line camelcase
	}

	render() {
		let css;
		if (process.env.NODE_ENV === `production`) {
			css = (
				<style
					id="gatsby-inlined-css"
					dangerouslySetInnerHTML={{__html: stylesStr}} // eslint-disable-line
				/>
			);
		}

		return (
			<html op="news" lang="en">
				<head>
					{this.props.headComponents}
					<meta name="referrer" content="origin"/>
					<meta charSet="utf-8"/>
					<meta httpEquiv="X-UA-Compatible" content="IE=edge"/>
					<meta name="viewport" content="width=device-width, height=device-height, initial-scale=1, user-scalable=no"/>
					{/* <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0-beta/css/materialize.min.css"/> */}
					{css}
				</head>
				<body>
					<div
						id="___gatsby"
						dangerouslySetInnerHTML={{__html: this.props.body}} //eslint-disable-line
					/>
					{this.props.postBodyComponents}
					<script src="//maps.googleapis.com/maps/api/js?key=AIzaSyAZyFJjtN1lLLz3UoVF_mDelyTQOSZ0-rY" async/>
					{process.env.NODE_ENV === `production` ? this.renderScripts() : null}
				</body>
			</html>
		);
	}

	renderScripts() {
		const gTag = `window.dataLayer = window.dataLayer || [];
		function gtag(){dataLayer.push(arguments);}
		gtag('js', new Date());
		gtag('config', 'AW-997082626');`;

		const numberScript = `window.vs_account_id = "fwABAVssGPNPYgDM";`;

		return (
			<div>
				<script src="https://www.googletagmanager.com/gtag/js?id=AW-997082626" async/>
				{/* eslint-disable-next-line react/no-danger */}
				<script dangerouslySetInnerHTML={{__html: gTag}}/>
				{/* START number */}
				{/* eslint-disable-next-line react/no-danger */}
				<script dangerouslySetInnerHTML={{__html: numberScript}}/>
				<script type="text/javascript" src="https://rw1.calls.net/euinc/number-changer.js" async/>
				{/* END number */}
			</div>
		);
	}
}
