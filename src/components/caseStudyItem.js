import React from 'react';
import PropTypes from 'prop-types';
import Link from 'gatsby-link';
import Svg from 'react-svg-inline';

import {innerHtml} from '../utils/wordpressHelpers';
import Image from './image';
import CSS from '../css/modules/caseStudyItem.module.scss';

const CaseStudyItem = ({image, logo, title, subtitle, slug}) => {
	return (
		<Link to={`/case-study/${slug}`} className={CSS.caseStudy}>
			<div className={CSS.header}>
				<div className={CSS.image}>
					<Image
						preload
						url={image.url}
						sizes={image.localFile.childImageSharp.sizes}
						naturalWidth={image.mediaDetails.width}
						natrualHeight={image.mediaDetails.height}
						imgStyle={{height: '100%', width: '100%'}}
					/>
				</div>
				<div className={CSS.logo}>
					<div className={CSS.logoWrap}>
						<div style={{maxWidth: 150, margin: '0 auto'}}>{logo && logo !== '' ? <Svg svg={logo}/> : null}</div>
					</div>
				</div>
				<div className={CSS.overlay}>
					<span className="btn btn-cta-white">Learn More</span>
				</div>
			</div>
			<div className={CSS.content}>
				{/* eslint-disable react/no-danger */}
				<p className={CSS.title} dangerouslySetInnerHTML={innerHtml(title)}/>
				{/* eslint-enable react/no-danger */}
				<p className={CSS.subtitle}>{subtitle}</p>
			</div>
		</Link>
	);
};

CaseStudyItem.propTypes = {
	image: PropTypes.object.isRequired,
	title: PropTypes.string.isRequired,
	subtitle: PropTypes.string.isRequired,
	logo: PropTypes.string.isRequired,
	slug: PropTypes.string.isRequired
};

export default CaseStudyItem;
