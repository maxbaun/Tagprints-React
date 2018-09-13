import React from 'react';
import PropTypes from 'prop-types';
import Link from 'gatsby-link';
import Svg from 'react-svg-inline';

import {innerHtml} from '../utils/wordpressHelpers';
import Image from './imagev2';
import CSS from '../css/modules/caseStudyItem.module.scss';

const CaseStudyItem = ({image, logo, title, subtitle, slug}) => {
	return (
		<Link to={`/case-study/${slug}`} className={CSS.caseStudy}>
			<div className={CSS.header}>
				<div className={CSS.image}>
					<Image
						showPlaceholder
						image={image}
						imgStyle={{height: '100%', width: '100%'}}
					/>
				</div>
				{logo ? (
					<div className={CSS.logo}>
						<div className={CSS.logoWrap}>
							<div style={{maxWidth: 150, margin: '0 auto'}}>
								{logo && logo !== '' ? <Svg svg={logo}/> : null}
							</div>
						</div>
					</div>
				) : null}
				<div className={CSS.overlay}>
					<span className="btn btn-cta-white">Learn More</span>
				</div>
			</div>
			<div className={CSS.content}>
				{/* eslint-disable react/no-danger */}
				<p className={CSS.title} dangerouslySetInnerHTML={innerHtml(title)}/>
				{/* eslint-enable react/no-danger */}
				{subtitle ? <p className={CSS.subtitle}>{subtitle}</p> : null}
			</div>
		</Link>
	);
};

CaseStudyItem.propTypes = {
	image: PropTypes.object,
	title: PropTypes.string.isRequired,
	subtitle: PropTypes.string,
	logo: PropTypes.string,
	slug: PropTypes.string.isRequired
};

CaseStudyItem.defaultProps = {
	image: {},
	logo: null,
	subtitle: null
};

export default CaseStudyItem;
