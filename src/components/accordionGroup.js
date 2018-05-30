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
			this.badger = new Badger(`#${this.props.id}`);
		}, 300);
	}

	render() {
		const {items, id, classname} = this.props;

		return (
			<div className={[CSS.accordionGroup, classname].join(' ')}>
				<dl id={id} className="badger-accordion js-badger-accordion">
					{items.map(item => {
						return (
							<Fragment key={item.header}>
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
										className="badger-accordion__panel-inner text-module js-badger-accordion-panel-inner"
										dangerouslySetInnerHTML={innerHtml(
											item.content
										)}
									/>
									{/* eslint-enable react/no-danger */}
								</dd>
							</Fragment>
						);
					})}
				</dl>
			</div>
		);
	}
}
