import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Link from 'gatsby-link';

import {unique} from '../utils/componentHelpers';

export default class Categories extends Component {
	constructor(props) {
		super(props);

		this.fetch = unique();
	}

	static propTypes = {
		categories: PropTypes.array,
		activeCategory: PropTypes.string,
		allLink: PropTypes.string.isRequired
	};

	static defaultProps = {
		categories: [],
		activeCategory: null
	};

	render() {
		const {categories, activeCategory, allLink} = this.props;
		const compileWrapCSS = ['our-work-categories', categories && categories.length > 0 ? 'our-work-categories__active' : ''];
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
						let compileCSS = [activeCategory === category.slug ? 'active' : ''];

						return (
							<li key={category.id} className={compileCSS.join(' ')}>
								<Link to={category.link}>
									<span>{category.name}</span>
								</Link>
							</li>
						);
					})}
				</ul>
			</div>
		);
	}
}
