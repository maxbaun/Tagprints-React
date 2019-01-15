import React from 'react';
import PropTypes from 'prop-types';

import CSS from '../css/modules/experienceCards.module.scss';
import Link from './link';
import ImageV2 from './imagev2';

const ExperienceCards = ({cards}) => {
	return (
		<div className={CSS.experienceCards}>
			<ul>
				{cards.map(card => {
					return (
						<li key={card.title}>
							<div className={CSS.card}>
								<div className={CSS.cardImage}>
									<ImageV2 image={card.image} imgStyle={{height: '100%'}}/>
									<div className={CSS.overlay}>
										<Link
											className={CSS.learnMore}
											to={card.link.url}
										>
											{card.link.title || 'View More +'}
										</Link>
									</div>
								</div>
								<Link
									className={CSS.title}
									to={card.link.url}
								>
									{card.title}
								</Link>
							</div>
						</li>
					)
				})}

			</ul>
		</div>
	)
}

ExperienceCards.propTypes = {
	cards: PropTypes.array.isRequired
}

export default ExperienceCards;
