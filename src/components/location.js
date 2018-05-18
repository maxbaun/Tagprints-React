import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {ref} from '../utils/componentHelpers';
import Marker from '../images/marker.png';
import CSS from '../css/modules/location.module.scss';

export default class Location extends Component {
	constructor(props) {
		super(props);

		this.map = null;
		this.mapRef = null;
	}

	static propTypes = {
		title: PropTypes.string,
		address: PropTypes.string,
		directions: PropTypes.string,
		lat: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
		lng: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
	};

	static defaultProps = {
		title: null,
		address: null,
		directions: null,
		lat: 0,
		lng: 0
	};

	componentDidMount() {
		this.init();
	}

	init() {
		const {lat, lng} = this.props;
		const marker = new google.maps.LatLng(parseFloat(lat), parseFloat(lng));

		const mapStyles = [
			{
				featureType: 'all',
				elementType: 'all',
				stylers: [{saturation: -100}]
			}
		];

		console.log(google);

		const mapOptions = {
			scrollwheel: false,
			center: marker,
			zoom: 17,
			panControl: false,
			zoomControl: false,
			mapTypeControl: false,
			scaleControl: false,
			streetViewControl: false,
			mapTypeControlOptions: {
				mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'grey']
			},
			styles: [
				{
					stylers: [
						{
							saturation: -100
						}
					]
				}
			]
		};

		this.mapRef = new google.maps.Map(this.map, mapOptions); //eslint-disable-line

		const mapType = new google.maps.StyledMapType(mapStyles, {
			name: 'Grayscale'
		});

		this.mapRef.mapTypes.set('grey', mapType);
	}

	render() {
		const {directions, title, address} = this.props;

		return (
			<div className={CSS.location}>
				<div ref={ref.call(this, 'map')} className={CSS.map}/>
				<div className={CSS.overlay}>
					<div className={CSS.contentWrap}>
						<div className={CSS.content}>
							<div className={CSS.marker}>
								<img src={Marker} alt={`${title} - Marker`}/>
							</div>
							<h3 className={CSS.title}>{title}</h3>
							<h5 className={CSS.address}>{address}</h5>
							<hr className={CSS.break}/>
							<a
								href={directions}
								target="_blank"
								className={[
									'btn',
									'btn-cta-transparent-white',
									'readmore',
									CSS.link
								].join(' ')}
							>
								Get Directions
							</a>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
