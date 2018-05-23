import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Img from 'gatsby-image';

import CSS from '../css/modules/hero.module.scss';
import ScrollSpy from './scrollSpy';
import {replaceLinks} from '../utils/wordpressHelpers';

export default class Hero extends Component {
	constructor(props) {
		super(props);

		this.state = {
			active: false
		};

		this.handleImageLoad = this.handleImageLoad.bind(this);
	}

	static propTypes = {
		backgroundImage: PropTypes.object.isRequired,
		children: PropTypes.element.isRequired,
		buttons: PropTypes.array,
		heroClass: PropTypes.string,
		scrollTo: PropTypes.string
	};

	static defaultProps = {
		buttons: [],
		heroClass: null,
		scrollTo: null
	};

	handleImageLoad() {
		setTimeout(() => {
			this.setState({active: true});
		}, 150);
	}

	render() {
		const {
			heroClass,
			buttons,
			scrollTo,
			children,
			backgroundImage
		} = this.props;
		const {active} = this.state;

		const wrapClass = [
			CSS.hero,
			CSS[heroClass],
			active ? CSS.heroActive : ''
		];

		return (
			<div className={wrapClass.join(' ')}>
				<div className={CSS.image}>
					<Img
						sizes={backgroundImage}
						onLoad={this.handleImageLoad}
					/>
				</div>
				<div className={CSS.inner}>
					<div className={CSS.content}>
						<div className={CSS.contentInner}>
							{children}
							<ul className={CSS.buttons}>
								{buttons &&
									buttons.map(button => {
										return (
											<li key={button.url}>
												<a
													href={replaceLinks(
														button.url
													)}
													className={`btn ${
														button.class
													}`}
												>
													{button.text}
												</a>
											</li>
										);
									})}
							</ul>
						</div>
					</div>
					{scrollTo ? (
						<ScrollSpy target={scrollTo}>
							<a className={CSS.scrollTo}/>
						</ScrollSpy>
					) : null}
				</div>
			</div>
		);
	}
}
