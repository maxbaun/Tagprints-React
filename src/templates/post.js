import React, {Component} from 'react';
import PropTypes from 'prop-types';
import graphql from 'graphql';

import {innerHtml} from '../utils/wordpressHelpers';
import Fragment from '../components/fragment';
import Seo from '../components/seo';
import CSS from '../css/modules/post.module.scss';

export default class PostTemplate extends Component {
	static propTypes = {
		data: PropTypes.object.isRequired,
		location: PropTypes.object.isRequired,
		site: PropTypes.object.isRequired
	};

	render() {
		const {currentPost} = this.props.data;

		return (
			<Fragment>
				<Seo
					currentPage={currentPost}
					site={this.props.site}
					location={this.props.location}
				/>
				<main className="main" role="main">
					<div className="container">
						<article className={CSS.article}>
							<header className={CSS.header}>
								<h1
									// eslint-disable-next-line react/no-danger
									dangerouslySetInnerHTML={innerHtml(
										currentPost.title
									)}
									className={CSS.title}
								/>
								<div className={CSS.meta}>
									<span>{currentPost.date} </span>
									{currentPost.categories &&
										currentPost.categories.map(category => {
											return (
												<span key={category.name}>
													{' / '}
													{category.name}
												</span>
											);
										})}
								</div>
							</header>
							<div
								className={CSS.content}
								// eslint-disable-next-line react/no-danger
								dangerouslySetInnerHTML={innerHtml(
									currentPost.content
								)}
							/>
						</article>
					</div>
				</main>
			</Fragment>
		);
	}
}

import {Post} from '../utils/fragments'; // eslint-disable-line no-unused-vars

export const postQuery = graphql`
	query postQuery($id: String!) {
		currentPost: wordpressPost(id: {eq: $id}) {
			...Post
		}
	}
`;
