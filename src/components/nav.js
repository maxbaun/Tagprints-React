import React from 'react';
import PropTypes from 'prop-types';
import Link from 'gatsby-link';

import {replaceLinks} from '../utils/wordpressHelpers';
import {click} from '../utils/componentHelpers';
import {getDataTheme} from '../utils/documentHelpers';
import CSS from '../css/modules/nav.module.scss';

const Nav = ({classes, items, id, onLinkClick: handleLinkClick, showCta, location}) => {
	const wrapClass = [CSS.menu, CSS[classes]];

	return (
		<ul id={id} className={wrapClass.join(' ')} data-theme={getDataTheme(location)} data-theme-toggle="true">
			{items &&
				items.map((item, index) => {
					const hasChildren = Boolean(item.children && item.children.length);

					const classes = hasChildren ? [CSS.dropdownWrap] : [];

					const linkClasses = [CSS.link];

					if (index < items.length - 1) {
						linkClasses.push(CSS.linkBordered);
					}

					return (
						<li key={item.url} className={classes.join(' ')}>
							<Link
								to={hasChildren ? replaceLinks(item.children[0].url) : replaceLinks(item.url)}
								onClick={click(handleLinkClick, item)}
								title={item.title}
								className={linkClasses.join(' ')}
							>
								{item.title}{' '}
							</Link>
							{hasChildren ? (
								<div className={CSS.dropdown}>
									<ul className={CSS.dropdownInner}>
										{item.children &&
											item.children.map(child => {
												return (
													<li key={child.url} className={classes}>
														<Link
															to={replaceLinks(child.url)}
															onClick={click(handleLinkClick, child)}
															title={child.title}
															className={CSS.dropdownLink}
														>
															{child.title}
														</Link>
													</li>
												);
											})}
									</ul>
								</div>
							) : null}
						</li>
					);
				})}
			{showCta ? (
				<li className={CSS.ctaWrap}>
					<Link to="/free-quote" className={CSS.cta}>
						Free Quote
					</Link>
				</li>
			) : null}
		</ul>
	);
};

Nav.propTypes = {
	items: PropTypes.array,
	classes: PropTypes.string,
	id: PropTypes.string,
	onLinkClick: PropTypes.func,
	showCta: PropTypes.bool,
	location: PropTypes.object.isRequired
};

Nav.defaultProps = {
	items: [],
	classes: 'nav navbar-nav',
	id: 'menu-primary-navigation',
	onLinkClick: () => {},
	showCta: false
};

export default Nav;
