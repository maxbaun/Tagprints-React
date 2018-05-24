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
		title: PropTypes.string.isRequired,
		faqs: PropTypes.array.isRequired,
		classname: PropTypes.string,
		accordionClass: PropTypes.string
	};

	static defaultProps = {
		classname: '',
		accordionClass: ''
	};

	componentDidMount() {
		const Badger = require('badger-accordion');
		this.badger = new Badger(`#${this.props.id}`);
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
						<h3>{title}</h3>
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
