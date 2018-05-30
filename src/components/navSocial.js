import React from 'react';
import PropTypes from 'prop-types';

import CSS from '../css/modules/navSocial.module.scss';

const NavSocial = ({showPhone, classname}) => {
	const wrapClass = [CSS.icons, CSS[classname]];

	return (
		<ul
			className={wrapClass.join(' ')}
			data-theme="default"
			data-theme-toggle="true"
		>
			<li className={CSS.icon}>
				<a href="//www.facebook.com/Tagprints/" target="__blank">
					<span className="fa fa-facebook"/>
				</a>
			</li>
			<li className={CSS.icon}>
				<a href="//www.twitter.com/Tagprints/" target="__blank">
					<span className="fa fa-twitter"/>
				</a>
			</li>
			<li className={CSS.icon}>
				<a href="//www.instagram.com/Tagprints/" target="__blank">
					<span className="fa fa-instagram"/>
				</a>
			</li>
			{showPhone ? <li className={CSS.separator}/> : null}
			{showPhone ? (
				<li className={CSS.icon}>
					<a href="tel:6309487779">
						<span className="fa fa-phone"/>
					</a>
				</li>
			) : null}
			{showPhone ? (
				<li className={CSS.number}>
					<a href="tel:6309487779">630-948-7779</a>
				</li>
			) : null}
		</ul>
	);
};

NavSocial.propTypes = {
	showPhone: PropTypes.bool,
	classname: PropTypes.string
};

NavSocial.defaultProps = {
	showPhone: false,
	classname: ''
};

export default NavSocial;
