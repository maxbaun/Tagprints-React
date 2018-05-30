import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Link from 'gatsby-link';

import Logo from './logo';
import Nav from './nav';
import NavSocial from './navSocial';
import {clickPrevent, ref, click} from '../utils/componentHelpers';
import CSS from '../css/modules/header.module.scss';

export default class Header extends Component {
	constructor(props) {
		super(props);

		this.state = {
			menuActive: false
		};

		this.menu = null;
		this.toggle = null;
		this.handleToggle = this.handleToggle.bind(this);
		this.checkClick = this.checkClick.bind(this);
	}

	static propTypes = {
		items: PropTypes.array
	};

	static defaultProps = {
		items: []
	};

	componentDidMount() {
		document.addEventListener('click', this.checkClick);
	}

	componentWillUnmount() {
		document.removeEventListener('click', this.checkClick);
	}

	checkClick(e) {
		if (
			(this.menu && this.menu.contains(e.target)) ||
			(this.toggle && this.toggle.contains(e.target))
		) {
			return;
		}

		this.setState({menuActive: false});
	}

	handleToggle(menuActive) {
		this.setState({menuActive});
	}

	render() {
		const {menuActive} = this.state;

		const menuClass = [CSS.menu];

		if (menuActive) {
			menuClass.push(CSS.menuActive);
		}

		return (
			<header
				className={CSS.header}
				data-theme="default"
				data-theme-toggle="true"
			>
				<div className={CSS.inner}>
					<div className={CSS.navTop} role="banner">
						<NavSocial showPhone classname="header"/>
					</div>
					<div className={CSS.navMain}>
						<div className={CSS.main}>
							<Link to="/">
								<Logo classname="header"/>
							</Link>
							<button
								ref={ref.call(this, 'toggle')}
								type="button"
								onClick={clickPrevent(
									this.handleToggle,
									!menuActive
								)}
								className={CSS.toggle}
								data-toggle="collapse"
								data-target=".navbar-collapse"
							>
								<span/>
								<span/>
								<span/>
							</button>
						</div>
						<div
							ref={ref.call(this, 'menu')}
							className={menuClass.join(' ')}
						>
							<Nav
								showCta
								items={this.props.items}
								id="menu-primary-navigation"
								classes="menuHeader"
								onLinkClick={click(this.handleToggle, false)}
							/>
							<div className={CSS.socialMobile}>
								<NavSocial showPhone classname="header"/>
							</div>
						</div>
					</div>
				</div>
			</header>
		);
	}
}
