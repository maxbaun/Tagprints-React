import React, {Component} from 'react';
import PropTypes from 'prop-types';

import CSS from '../css/modules/imageChanger.module.scss';
import Image from './imagev2';

export default class ImageChanger extends Component {
	constructor(props) {
		super(props);

		this.state = {
			activeImage: 0
		};

		this.changer = null;
		this.nextSlide = this.nextSlide.bind(this);
	}

	static propTypes = {
		images: PropTypes.array.isRequired,
		interval: PropTypes.number,
		imgStyle: PropTypes.object
	};

	static defaultProps = {
		interval: 5000,
		imgStyle: {}
	};

	componentDidMount() {
		this.startTransition();
	}

	componentWillUnmount() {
		this.stopTransition();
	}

	startTransition() {
		this.changer = setInterval(this.nextSlide, this.props.interval);
	}

	stopTransition() {
		clearInterval(this.changer);
		this.changer = null;
	}

	nextSlide() {
		const {activeImage} = this.state;
		const {images} = this.props;

		let nextIndex = activeImage + 1;

		if (nextIndex >= images.length) {
			nextIndex = 0;
		}

		this.setState({
			activeImage: nextIndex
		});
	}

	render() {
		const {images, imgStyle} = this.props;

		return (
			<div className={CSS.wrap}>
				{images.map((image, index) => {
					const imageClass = [CSS.image];

					if (index === this.state.activeImage) {
						imageClass.push(CSS.active);
					}

					return (
						<div key={image.id} className={imageClass.join(' ')}>
							<Image image={image} imgStyle={imgStyle}/>
						</div>
					);
				})}
			</div>
		);
	}
}
