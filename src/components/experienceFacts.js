import React from 'react';
import PropTypes from 'prop-types';

import CSS from '../css/modules/experienceFacts.module.scss';

const ExperienceFacts = ({yes, no}) => {
	return (
		<div className={CSS.wrap}>
			<div className={CSS.inner}>
				<div className={CSS.col}>
					<ul className={CSS.list}>
						{yes.map(o => {
							return (
								<li key={o.item} className={CSS.item}>
									<span className={CSS.icon}>
										<span className="icomoon-checkmark"/>
									</span>
									<span className={CSS.text}>{o.item}</span>
								</li>
							);
						})}
					</ul>
				</div>
				<div className={CSS.col}>
					<ul className={CSS.list}>
						{no.map(o => {
							return (
								<li key={o.item} className={CSS.item}>
									<span className={CSS.icon}>
										<span className="icomoon-x"/>
									</span>
									<span className={CSS.text}>{o.item}</span>
								</li>
							);
						})}
					</ul>
				</div>
			</div>
		</div>
	);
};

ExperienceFacts.propTypes = {
	yes: PropTypes.array,
	no: PropTypes.array
};

ExperienceFacts.defaultProps = {
	yes: [],
	no: []
};

export default ExperienceFacts;
