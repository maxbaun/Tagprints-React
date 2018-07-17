import React, {Component} from 'react';
import PropTypes from 'prop-types';

import CSS from '../css/modules/locationSelector.module.scss';
import {ref, click} from '../utils/componentHelpers';

export default class LocationSelector extends Component {
	constructor(props) {
		super(props);

		this.state = {
			activeLocation: 0
		};

		this.map = null;
		this.mapRef = null;
		this.handleLocationChange = this.handleLocationChange.bind(this);
	}

	static propTypes = {
		locations: PropTypes.array
	};

	static defaultProps = {
		locations: []
	};

	componentDidMount() {
		this.init();
	}

	getActiveLocation() {
		if (!this.props.locations || this.props.locations.length === 0) {
			return;
		}

		const {activeLocation} = this.state;

		return this.props.locations[activeLocation];
	}

	init() {
		if (typeof google === 'undefined') {
			return setTimeout(() => this.init(), 300);
		}

		const activeLocation = this.getActiveLocation();

		if (!activeLocation) {
			return;
		}

		const {lat, lng} = activeLocation;

		const marker = new google.maps.LatLng(parseFloat(lat), parseFloat(lng));

		const mapStyles = [
			{
				featureType: 'all',
				elementType: 'all',
				stylers: [{saturation: -100}]
			}
		];

		const mapOptions = {
			scrollwheel: false,
			center: marker,
			zoom: 16,
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

	handleLocationChange(activeLocation) {
		this.setState({activeLocation});
		const location = this.props.locations[activeLocation];
		const {lat, lng} = location;
		const center = new google.maps.LatLng(parseFloat(lat), parseFloat(lng));

		this.mapRef.setCenter(center);
	}

	render() {
		const activeLocation = this.getActiveLocation();
		const {activeLocation: activeIndex} = this.state;
		const {locations} = this.props;

		return (
			<div className={CSS.wrap}>
				<div ref={ref.call(this, 'map')} className={CSS.map}/>
				<div className={CSS.picker}>
					<ul>
						{locations.map((location, index) => {
							return (
								<li key={location.title}>
									<a onClick={click(this.handleLocationChange, index)} data-active={index === activeIndex ? 'true' : 'false'}>
										{location.title}
									</a>
								</li>
							);
						})}
					</ul>
				</div>
				<div className={CSS.overlay}>
					<div className={CSS.info}>
						<div className={CSS.infoMarker}>
							<span className="fa fa-map-marker"/>
						</div>
						<div className={CSS.infoInner}>
							<div className={CSS.infoContent}>
								<h3>{activeLocation.title}</h3>
								<p>{activeLocation.address}</p>
								<a target="_blank" rel="noopener noreferrer" href={activeLocation.directions}>
									Get Directions
									<span className="fa fa-long-arrow-right"/>
								</a>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
