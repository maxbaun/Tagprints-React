import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {List} from 'immutable';
import * as ImmutablePropTypes from 'react-immutable-proptypes';
import Link from 'gatsby-link';

import {unique, click} from '../utils/componentHelpers';

export default class Categories extends Component {
	constructor(props) {
		super(props);

		this.fetch = unique();
	}

	static propTypes = {
		categories: ImmutablePropTypes.list,
		activeCategory: PropTypes.string,
		allLink: PropTypes.string.isRequired
	};

	static defaultProps = {
		categories: List(),
		activeCategory: null
	};

	render() {
		const {categories, activeCategory, allLink} = this.props;
		const compileWrapCSS = [
			'our-work-categories',
			categories && categories.count() > 0 ?
				'our-work-categories__active' :
				''
		];
		const compileAllCSS = [activeCategory ? '' : 'active'];

		return (
			<div className={compileWrapCSS.join(' ')}>
				<ul>
					<li className={compileAllCSS.join(' ')}>
						<Link to={allLink}>
							<span>All</span>
						</Link>
					</li>
					{categories.map(category => {
						let compileCSS = [
							activeCategory === category.get('slug') ?
								'active' :
								''
						];

						return (
							<li
								key={category.get('id')}
								className={compileCSS.join(' ')}
							>
								<Link to={category.get('link')}>
									<span>{category.get('name')}</span>
								</Link>
							</li>
						);
					})}
				</ul>
			</div>
		);
	}
}
