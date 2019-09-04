import React, {Component} from 'react';
import PropTypes from 'prop-types';

import AccordionGroup from './accordionGroup';
import CSS from '../css/modules/sectionFaq.module.scss';

export default class SectionFaq extends Component {
	constructor(props) {
		super(props);

		this.badger = null;
	}

	static propTypes = {
		id: PropTypes.string.isRequired,
		title: PropTypes.string,
		faqs: PropTypes.array.isRequired,
		classname: PropTypes.string,
		accordionClass: PropTypes.string
	};

	static defaultProps = {
		classname: '',
		accordionClass: '',
		title: null
	};

	componentDidMount() {
		const Badger = require('badger-accordion');

		setTimeout(() => {
			this.badger = new Badger();
		}, 1000);
	}

	render() {
		const {id, title, faqs, classname, accordionClass} = this.props;
		return (
			<section
				id={id}
				className={[CSS.sectionFaq, CSS[classname]].join(' ')}
			>
				<div className={CSS.inner}>
					<div className="container">
						{title ? <h3>{title}</h3> : null}
						<div className={CSS.faqs}>
							<AccordionGroup
								id={`${id}Accordion`}
								items={faqs}
								classname={accordionClass}
							/>
						</div>
					</div>
				</div>
			</section>
		);
	}
}
