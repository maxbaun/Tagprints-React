import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Img from 'gatsby-image';
import Youtube from 'react-youtube';

import CSS from '../css/modules/hero.module.scss';
import ScrollSpy from './scrollSpy';
import Modal from './modal';
import Link from './link';
import {replaceLinks, getYoutubeIdFromLink} from '../utils/wordpressHelpers';

export default class Hero extends Component {
	constructor(props) {
		super(props);

		this.state = {
			active: false,
			modalOpen: false,
			content: ''
		};

		this.handleImageLoad = this.handleImageLoad.bind(this);
		this.handleLinkClick = this.handleLinkClick.bind(this);
		this.handleModalClose = this.handleModalClose.bind(this);
		this.renderModalContent = this.renderModalContent.bind(this);
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

	isModalLink(link) {
		const youtubeId = getYoutubeIdFromLink(link);

		if (youtubeId) {
			return true;
		}

		return false;
	}

	openModal(url) {
		return this.setState({
			modalOpen: true,
			content: url
		});
	}

	handleModalClose() {
		this.setState({
			modalOpen: false,
			content: null
		});
	}

	handleImageLoad() {
		setTimeout(() => {
			this.setState({active: true});
		}, 150);
	}

	handleLinkClick(url) {
		return e => {
			let isMobile = false;

			if (typeof window !== 'undefined') {
				isMobile = window.innerWidth < 992;
			}

			if (!this.isModalLink(url) || isMobile) {
				return;
			}

			e.preventDefault();

			return this.openModal(url);
		};
	}

	render() {
		const {heroClass, buttons, scrollTo, children, backgroundImage} = this.props;
		const {active, modalOpen} = this.state;

		const wrapClass = [CSS.hero, CSS[heroClass], active ? CSS.heroActive : ''];

		return (
			<div className={wrapClass.join(' ')}>
				<Modal showClose active={modalOpen} onClose={this.handleModalClose} height={558} width={992}>
					{this.renderModalContent()}
				</Modal>
				<div className={CSS.image}>
					<Img sizes={backgroundImage} onLoad={this.handleImageLoad}/>
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
												<Link
													onClick={this.handleLinkClick(button.url)}
													to={replaceLinks(button.url)}
													className={`btn ${button.class}`}
												>
													{button.text}
												</Link>
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

	renderModalContent() {
		const {content} = this.state;
		const youtubeId = getYoutubeIdFromLink(content);

		if (youtubeId) {
			return (
				<Youtube
					videoId={youtubeId}
					opts={{
						height: 558,
						width: 992,
						playerVars: {
							autoplay: 1,
							controls: 0,
							showinfo: 0
						}
					}}
				/>
			);
		}
	}
}
