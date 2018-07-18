import React from 'react';
import PropTypes from 'prop-types';
import Link from 'gatsby-link';

import Nav from './nav';
import NavSocial from './navSocial';
import CSS from '../css/modules/footer.module.scss';
import Logo from './logo';
import {getDataTheme} from '../utils/documentHelpers';

const Footer = ({menu, location}) => {
	return (
		<footer className={CSS.footer} data-theme={getDataTheme(location)} data-theme-toggle="true">
			<div className={CSS.inner}>
				<div className={CSS.main}>
					<Nav id="footer-navigation" classes="menuFooter" items={menu.items} location={location}/>
					<div className={CSS.social}>
						<NavSocial showPhone={false} classname="footer"/>
					</div>
				</div>
				<div className={CSS.logo}>
					<Logo width={350.6} height={68.3} classname="footer"/>
				</div>
				<div className={CSS.copy}>
					© TagPrints Digital | Digital Marketing and Social Media Agency in Chicago 2015<br/>
					<br/>
					<div className="text-center">
						<Link to="/privacy-policy">Privacy Policy</Link>
					</div>
				</div>
			</div>
		</footer>
	);
};

Footer.propTypes = {
	menu: PropTypes.object,
	location: PropTypes.object.isRequired
};

Footer.defaultProps = {
	menu: {
		items: []
	}
};

export default Footer;
