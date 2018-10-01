import React from 'react';
import PropTypes from 'prop-types';

import CSS from '../css/modules/experienceBlocks.module.scss';
import ImageV2 from './imagev2';
import {innerHtml} from '../utils/wordpressHelpers';

const ExperienceBlocks = ({blocks}) => {
	return (
		<div className={CSS.wrap}>
			<ul className={CSS.blocks}>
				{blocks &&
					blocks.map(block => {
						return (
							<li key={block.title} className={CSS.block}>
								<div className={CSS.blockInner}>
									<div className={CSS.blockImage}>
										<ImageV2
											image={block.icon}
											imgStyle={{
												width: block.icon.mediaDetails.width,
												height: block.icon.mediaDetails.height,
												maxWidth: block.icon.mediaDetails.width / 2,
												maxHeight: block.icon.mediaDetails.height / 2
											}}
											style={{
												width: block.icon.mediaDetails.width / 2,
												height: block.icon.mediaDetails.height / 2,
												display: 'inline-block'
											}}
										/>
									</div>
									<div className={CSS.blockCopy}>
										<h5 className={CSS.blockTitle}>{block.title}</h5>
										<p className={CSS.blockText}>{block.text}</p>
									</div>
								</div>
							</li>
						);
					})}
			</ul>
		</div>
	);
};

ExperienceBlocks.propTypes = {
	blocks: PropTypes.array
};

ExperienceBlocks.defaultProps = {
	blocks: []
};

export default ExperienceBlocks;
