import React from 'react';
import PropTypes from 'prop-types';

const NavSocial = ({classes, showPhone}) => {
	return (
		<ul className={classes}>
			<li>
				<a href="//www.facebook.com/Tagprints/" target="__blank">
					<span className="fa fa-facebook"/>
				</a>
			</li>
			<li>
				<a href="//www.twitter.com/Tagprints/" target="__blank">
					<span className="fa fa-twitter"/>
				</a>
			</li>
			<li>
				<a href="//www.instagram.com/Tagprints/" target="__blank">
					<span className="fa fa-instagram"/>
				</a>
			</li>
			{showPhone ? <li className="separator"/> : null}
			{showPhone ?
				<li>
					<a href="tel:6309487779">
						<span className="fa fa-phone"/>
					</a>
				</li> : null
			}
			{showPhone ?
				<li className="number">
					<a href="tel:6309487779">
						630-948-7779
					</a>
				</li> : null
			}
		</ul>
	);
};

NavSocial.propTypes = {
	classes: PropTypes.string,
	showPhone: PropTypes.bool
};

NavSocial.defaultProps = {
	classes: 'nav navbar-nav social-icons',
	showPhone: false
};

export default NavSocial;
