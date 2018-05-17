import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Link from 'gatsby-link';

import Logo from './logo';
import Nav from './nav';
import NavSocial from './navSocial';
import {clickPrevent, ref} from '../utils/componentHelpers';

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

		const navClass = ['collapse', 'navbar-collapse'];

		if (menuActive) {
			navClass.push('in');
		}

		return (
			<header>
				<div className="banner navbar navbar-social" role="banner">
					<div className="container">
						<NavSocial
							showPhone
							classes="nav navbar-nav navbar-right social-icons"
						/>
					</div>
				</div>
				<div className="banner navbar navbar-main" role="banner">
					<div className="container">
						<div className="navbar-header">
							<button
								ref={ref.call(this, 'toggle')}
								type="button"
								onClick={clickPrevent(
									this.handleToggle,
									!menuActive
								)}
								className="navbar-toggle collapsed"
								data-toggle="collapse"
								data-target=".navbar-collapse"
							>
								<span className="icon-bar"/>
								<span className="icon-bar"/>
								<span className="icon-bar"/>
							</button>
							<Link className="navbar-brand" to="/">
								<Logo/>
							</Link>
						</div>
						<div
							ref={ref.call(this, 'menu')}
							className={navClass.join(' ')}
							role="navigation"
						>
							<div className="navbar-right">
								<Nav
									items={this.props.items}
									id="menu-primary-navigation"
									classes="nav navbar-nav main-navigation"
								/>
								<ul className="nav navbar-nav navbar-cta">
									<li>
										<Link
											to="/free-quote"
											className="btn btn-cta-transparent"
										>
											Free Quote
										</Link>
									</li>
								</ul>
							</div>
							<NavSocial
								showPhone
								classes="nav navbar-nav navbar-right social-icons"
							/>
						</div>
					</div>
				</div>
			</header>
		);
	}
}
