import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Link from 'gatsby-link';

import CSS from '../css/modules/workHeader.module.scss';

const HeaderViews = {
	caseStudies: {
		title: 'Case Studies',
		subtitle: 'Trusted by Agencies, Loved by Brands',
		icon: 'fa fa-chevron-left',
		link: '/our-work/lookbook',
		switch: 'left'
	},
	lookbook: {
		title: 'Lookbook',
		subtitle: 'Take a look and get inspired!',
		icon: 'fa fa-chevron-right',
		link: '/our-work/case-studies',
		switch: 'right'
	}
};

export default class WorkHeader extends Component {
	constructor(props) {
		super(props);

		this.getView = this.getView.bind(this);
	}

	static propTypes = {
		location: PropTypes.object.isRequired
	};

	getView(location = this.props.location) {
		const {pathname} = location;

		if (pathname.indexOf('lookbook') > -1) {
			return HeaderViews.lookbook;
		}

		return HeaderViews.caseStudies;
	}

	render() {
		const view = this.getView();

		return (
			<div className={CSS.header}>
				<div className="container">
					<h1 className={CSS.title}>{view.title}</h1>
					<h3 className={CSS.subtitle}>{view.subtitle}</h3>
					<Link className={CSS.switch} to={view.link}>
						<span
							className={CSS.switchText}
							data-active={view.switch === 'left'}
						>
							Case Studies
						</span>
						<div className={CSS.switchInner}>
							<div className={CSS.switchCircle} data-position={view.switch}>
								<span className={view.icon}/>
							</div>
						</div>
						<span
							className={CSS.switchText}
							data-active={view.switch === 'right'}
						>
							Lookbook
						</span>
					</Link>
				</div>
			</div>
		);
	}
}
