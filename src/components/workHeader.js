import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Link from 'gatsby-link';

const HeaderViews = {
	lookbook: {
		title: 'Lookbook',
		subtitle: 'Take a look and get inspired!',
		icon: 'fa fa-chevron-right',
		link: '/our-work/case-studies',
		switch: 'left'
	},
	caseStudies: {
		title: 'Case Studies',
		subtitle: 'Trusted by Agencies, Loved by Brands',
		icon: 'fa fa-chevron-left',
		link: '/our-work/lookbook',
		switch: 'right'
	}
};

export default class WorkHeader extends Component {
	constructor(props) {
		super(props);

		this.getView = this.getView.bind(this);
		this.handleToggleView = this.handleToggleView.bind(this);
	}

	static propTypes = {
		location: PropTypes.object.isRequired
	};

	getView(location = this.props.location) {
		const {pathname} = location;

		if (pathname.indexOf('case-studies') > -1) {
			return HeaderViews.caseStudies;
		}

		return HeaderViews.lookbook;
	}

	render() {
		const view = this.getView();

		return (
			<div className="our-work-header">
				<div className="container">
					<h1 className="our-work-header__title">{view.title}</h1>
					<h3 className="our-work-header__subtitle">
						{view.subtitle}
					</h3>
					<Link className="our-work-header__switch" to={view.link}>
						<span
							className="our-work-header__switch__text left"
							data-active={view.switch === 'left'}
						>
							Lookbook
						</span>
						<div className="our-work-header__switch__inner">
							<div
								className="our-work-header__switch__circle"
								data-position={view.switch}
							>
								<span className={view.icon}/>
							</div>
						</div>
						<span
							className="our-work-header__switch__text right"
							data-active={view.switch === 'right'}
						>
							Case Studies
						</span>
					</Link>
				</div>
			</div>
		);
	}
}
