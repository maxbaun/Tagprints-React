import React from 'react';
import PropTypes from 'prop-types';

import CSS from '../css/modules/experienceDescription.module.scss';
import {innerHtml} from '../utils/wordpressHelpers';

const ExperienceDescription = ({content}) => {
	return <div dangerouslySetInnerHTML={innerHtml(content)} className={CSS.wrap}/>;
};

ExperienceDescription.propTypes = {
	content: PropTypes.string.isRequired
};

export default ExperienceDescription;
