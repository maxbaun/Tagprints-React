import React from 'react';
import PropTypes from 'prop-types';
import Link from 'gatsby-link';

import Nav from './nav';
import NavSocial from './navSocial';

const Footer = ({menu}) => {
	return (
		<footer className="content-info" role="contentinfo">
			<div className="footer-menu navbar navbar-main">
				<div className="container">
					<nav role="navigation">
						<Nav
							id="menu-primary-navigation-1"
							classes="nav navbar-nav"
							items={menu.items}
						/>
						<NavSocial
							showPhone={false}
							classes="nav navbar-nav social-icons"
						/>
					</nav>
				</div>
			</div>
			<div className="footer-copy">
				© TagPrints Digital | Digital Marketing and Social Media Agency in Chicago 2015<br/><br/>
				<div className="text-center">
					<Link to="/privacy-policy">Privacy Policy</Link>
				</div>
			</div>
		</footer>
	);
};

Footer.propTypes = {
	menu: PropTypes.object
};

Footer.defaultProps = {
	menu: {
		items: []
	}
};

export default Footer;
