import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {innerHtml} from '../utils/wordpressHelpers';
import Fragment from './fragment';
import CSS from '../css/modules/accordionGroup.module.scss';

export default class AccordionGroup extends Component {
	constructor(props) {
		super(props);

		this.badger = null;
	}

	static propTypes = {
		items: PropTypes.array,
		id: PropTypes.string.isRequired,
		classname: PropTypes.string
	};

	static defaultProps = {
		items: [],
		classname: ''
	};

	componentDidMount() {
		setTimeout(() => {
			const Badger = require('badger-accordion');

			const wrapper = document.getElementById(this.props.id);
			const acc = Array.from(wrapper.querySelectorAll('.badger-accordion'));

			acc.forEach(a => {
				new Badger(a); // eslint-disable-line
			});
		}, 300);
	}

	render() {
		const {items, id, classname} = this.props;

		return (
			<div id={id} className={[CSS.accordionGroup, classname].join(' ')}>
				{items.map((item, index) => {
					return (
						<dl key={item.header} id={`${id}-${index}`} className="badger-accordion js-badger-accordion" style={{marginBottom: 0}}>
							<dt
								key={item.header}
								className="badger-accordion__header"
							>
								<div className="badger-accordion__trigger js-badger-accordion-header">
									<div className="badger-accordion__trigger-title">
										{item.header}
									</div>
									<div className="badger-accordion__trigger-icon"/>
								</div>
							</dt>
							<dd className="badger-accordion__panel js-badger-accordion-panel">
								{/* eslint-disable react/no-danger */}
								<div
									dangerouslySetInnerHTML={innerHtml(
										item.content
									)}
									className="badger-accordion__panel-inner text-module js-badger-accordion-panel-inner"
								/>
								{/* eslint-enable react/no-danger */}
							</dd>
						</dl>
					);
				})}
			</div>
		);
	}
}
