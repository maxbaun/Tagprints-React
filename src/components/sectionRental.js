import React from 'react';
import PropTypes from 'prop-types';
import Link from 'gatsby-link';

import {replaceLinks} from '../utils/wordpressHelpers';
import CSS from '../css/modules/sectionRental.module.scss';

const SectionRental = ({title, cta, options, classname, btnClass}) => {
	console.log(cta);
	return (
		<section className={[CSS.sectionRental, CSS[classname]].join(' ')}>
			<div className={CSS.inner}>
				<div className={CSS.left}/>
				<div className={CSS.right}>
					<div className="container">
						<h3>{title}</h3>
						<div>
							<ul className={CSS.options}>
								{options.map(option => {
									const compileCss = option.accent ?
										[CSS.optionAccent] :
										[CSS.option];

									return (
										<li
											key={option.title}
											className={compileCss.join(' ')}
										>
											<Link to={replaceLinks(cta.url)}>
												<div
													className={CSS.optionInner}
												>
													<div
														className={
															CSS.optionIcon
														}
													>
														<span/>
													</div>
													<div
														className={
															CSS.optionContent
														}
													>
														<h5>{option.title}</h5>
														<p>{option.text}</p>
													</div>
												</div>
											</Link>
										</li>
									);
								})}
							</ul>
						</div>
						<Link to={replaceLinks(cta.url)} className={btnClass}>
							{cta.title}
						</Link>
					</div>
				</div>
			</div>
		</section>
	);
};

SectionRental.propTypes = {
	title: PropTypes.string.isRequired,
	cta: PropTypes.object.isRequired,
	options: PropTypes.array.isRequired,
	classname: PropTypes.string,
	btnClass: PropTypes.string
};

SectionRental.defaultProps = {
	classname: '',
	btnClass: ''
};

export default SectionRental;
