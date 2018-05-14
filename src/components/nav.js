import React from 'react';
import PropTypes from 'prop-types';
import Link from 'gatsby-link';

import {replaceLinks} from '../utils/wordpressHelpers';

const Nav = ({items, classes, id}) => {
	return (
		<ul id={id} className={classes}>
			{items && items.map(item => {
				const hasChildren = Boolean(item.children && item.children.length);
				const classes = hasChildren ? 'tab-dropdown dropdown' : '';

				return (
					<li key={item.url} className={classes}>
						<Link to={replaceLinks(item.url)} title={item.title}>
							{item.title}
							{' '}
							{hasChildren ? <span className="caret"/> : null}
						</Link>
						{hasChildren ?
							<ul role="menu" className="dropdown-menu">
								{item.children && item.children.map(child => {
									return (
										<li key={child.url} className={classes}>
											<Link to={replaceLinks(child.url)} title={child.title}>
												{child.title}
											</Link>
										</li>
									);
								})}
							</ul> : null
						}
					</li>
				);
			})}
		</ul>
	);
};

Nav.propTypes = {
	items: PropTypes.array,
	classes: PropTypes.string,
	id: PropTypes.string
};

Nav.defaultProps = {
	items: [],
	classes: 'nav navbar-nav',
	id: 'menu-primary-navigation'
};

export default Nav;
