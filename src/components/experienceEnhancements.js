import React from 'react';
import PropTypes from 'prop-types';

import CSS from '../css/modules/experienceEnhancements.module.scss';

const ExperienceEnhancements = ({items}) => {
	return (
		<div className={CSS.wrap}>
			<div className={CSS.inner}>
				<ul className={CSS.list}>
					{items.map((item, index) => {
						return (
							<li key={index} className={CSS.item}>
								<div className={CSS.icon}>
									<span className={`icomoon-${item.icon}`}/>
								</div>
								<div className={CSS.content}>
									<h5 className={CSS.title}>{item.title}</h5>
									<p className={CSS.text}>{item.text}</p>
								</div>
							</li>
						);
					})}
				</ul>
			</div>
		</div>
	);
};

ExperienceEnhancements.propTypes = {
	items: PropTypes.array
};

ExperienceEnhancements.defaultProp = {
	items: []
};

export default ExperienceEnhancements;
