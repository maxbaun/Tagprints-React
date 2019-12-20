import React, {Component} from 'react';

export default class Salesloft extends Component {
	render() {
		if (typeof window !== 'undefined' && window.slscout) {
			console.log('salesloft init');
			window.slscout(['init', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0IjoxMTg2OH0.4ZTLQ-jBLV9Jn3YY8327OzlZuEHJ_w2oLWILwrzsU8I']);
		}
		return null;
	}
}
