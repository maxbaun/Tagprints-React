import React from 'react';
import PropTypes from 'prop-types';

import {innerHtml} from '../utils/wordpressHelpers';
import CSS from '../css/modules/iconBlocks.module.scss';

const IconBlocks = ({classname, blocks}) => {
	return (
		<div className={[CSS.blocks, CSS[classname]].join(' ')}>
			<ul>
				{blocks.map(block => {
					return (
						<li key={block.title}>
							<div className={CSS.block}>
								<span className={`icomoon-${block.icon}`}/>
								{/* eslint-disable react/no-danger */}
								{
									<h5
										dangerouslySetInnerHTML={innerHtml(
											block.title
										)}
									/>
								}
								{
									<p
										dangerouslySetInnerHTML={innerHtml(
											block.text
										)}
									/>
								}
								{/* eslint-enable react/no-danger */}
							</div>
						</li>
					);
				})}
			</ul>
		</div>
	);
};

IconBlocks.propTypes = {
	classname: PropTypes.string,
	blocks: PropTypes.array.isRequired
};

IconBlocks.defaultProps = {
	classname: ''
};

export default IconBlocks;
