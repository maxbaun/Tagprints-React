import React, {Component} from 'react';
import PropTypes from 'prop-types';
import graphql from 'graphql';
import {fromJS} from 'immutable';

import {interleaveGalleries} from '../utils/lookbookHelpers';
import Fragment from '../components/fragment';
import Seo from '../components/seo';
import ImageGrid from '../components/imageGrid';
import Lightbox from '../components/lightbox';
import WorkCategories from '../components/workCategories';
import LookbookItem from '../components/lookbookItem';

const PerPage = 40;

export default class LookbooksTemplate extends Component {
	constructor(props) {
		super(props);

		this.state = {
			hasMore: true,
			page: 1,
			modalOpen: false,
			modalStart: 1,
			windowWidth: 0,
			lookbooks: interleaveGalleries(
				this.getAllLookbooks(props.data.lookbooks)
			)
		};

		this.getAllLookbooks = this.getAllLookbooks.bind(this);
		this.getPaginatedLookbooks = this.getPaginatedLookbooks.bind(this);
		this.getActiveCategory = this.getActiveCategory.bind(this);
		this.handleLoadMore = this.handleLoadMore.bind(this);
		this.handleImageClick = this.handleImageClick.bind(this);
		this.handleModalOpen = this.handleModalOpen.bind(this);
		this.handleModalClose = this.handleModalClose.bind(this);
		this.getLightboxImages = this.getLightboxImages.bind(this);
		this.getCategories = this.getCategories.bind(this);
		this.handleResize = this.handleResize.bind(this);
	}

	static propTypes = {
		data: PropTypes.object.isRequired,
		location: PropTypes.object.isRequired,
		pathContext: PropTypes.object.isRequired,
		site: PropTypes.object.isRequired
	};

	componentDidMount() {
		this.handleResize();

		window.addEventListener('resize', this.handleResize);
	}

	componentWillUnmount() {
		window.removeEventListener('resisze', this.handleResize);
	}

	getActiveCategory() {
		const activeSlug = this.props.pathContext.lookbookId;

		if (!activeSlug || activeSlug === '') {
			return;
		}

		const {lookbooks} = this.props.data;

		const activeCategory = lookbooks.edges.find(
			l => l.node.slug === activeSlug
		);

		return fromJS(activeCategory.node);
	}

	getAllLookbooks(lookbooks) {
		const l = lookbooks.edges.map(lookbook => {
			return {
				...lookbook.node
			};
		});

		return fromJS(l);
	}

	getActiveLookbooks(lookbooks = this.state.lookbooks) {
		const activeCategory = this.getActiveCategory();

		if (!activeCategory || !activeCategory.get) {
			return lookbooks;
		}

		const activeLookbooks = lookbooks.filter(
			l => l.get('lookbook') === activeCategory.get('slug')
		);

		return activeLookbooks;
	}

	getPaginatedLookbooks() {
		return this.getActiveLookbooks().take(PerPage * this.state.page);
	}

	getLightboxImages() {
		const lookbooks = this.getPaginatedLookbooks();

		return lookbooks
			.map(lookbook => {
				return {
					url: lookbook.get('url'),
					resolutions: lookbook.get('full') ?
						lookbook.get('full').toJS() :
						{},
					height: lookbook.get('height'),
					width: lookbook.get('width')
				};
			})
			.toJS();
	}

	getCategories() {
		const {lookbooks} = this.props.data;

		const lookbookMap = lookbooks.edges.map(b => {
			const lookbook = b.node;

			return {
				link: `/our-work/lookbook/${lookbook.slug}`,
				name: lookbook.title,
				id: lookbook.id,
				slug: lookbook.slug
			};
		});

		return fromJS(lookbookMap);
	}

	handleImageClick(image) {
		const lookbooks = this.getPaginatedLookbooks();

		const index = lookbooks.findIndex(
			lookbook => lookbook.get('key') === image.key
		);

		this.handleModalOpen(index + 1);
	}

	handleModalOpen(modalStart) {
		this.setState({
			modalOpen: true,
			modalStart
		});
	}

	handleModalClose() {
		this.setState({modalOpen: false});
	}

	handleLoadMore(page) {
		this.setState(prevState => {
			const lookbooks = this.getActiveLookbooks(prevState.lookbooks);
			const hasMore = page * PerPage < lookbooks.count();

			return {
				...prevState,
				page,
				hasMore
			};
		});
	}

	handleResize() {
		this.setState({
			windowWidth: document.body.clientWidth
		});
	}

	render() {
		const lookbooks = this.getPaginatedLookbooks();
		const activeCategory = this.getActiveCategory();

		let currentPage = {
			title: 'Lookbook'
		};

		if (activeCategory) {
			currentPage = {
				...activeCategory.toJS(),
				title: activeCategory.get('title') + ' Case Studies'
			};
		}

		return (
			<Fragment>
				<Seo
					currentPage={currentPage}
					site={this.props.site}
					location={this.props.location}
				/>
				<Lightbox
					images={this.getLightboxImages()}
					open={this.state.modalOpen}
					start={this.state.modalStart}
					onClose={this.handleModalClose}
				/>
				<main className="main" role="main">
					<div className="our-work-lookbooks">
						<div className="container">
							<WorkCategories
								activeCategory={
									activeCategory && activeCategory.get ?
										activeCategory.get('slug') :
										null
								}
								categories={this.getCategories()}
								allLink="/our-work"
							/>
						</div>
						<div className="our-work-lookbooks__gallery">
							<ImageGrid
								shuffleBtn="#shuffleGrid"
								items={lookbooks}
								component={LookbookItem}
								hasMore={this.state.hasMore}
								onLoadMore={this.handleLoadMore}
								onImageClick={this.handleImageClick}
								windowWidth={this.state.windowWidth}
							/>
						</div>
					</div>
				</main>
			</Fragment>
		);
	}
}

import {LargeImage} from '../utils/fragments'; // eslint-disable-line no-unused-vars

export const pageQuery = graphql`
	query lookbooksQuery {
		lookbooks: allWordpressWpLookbook {
			edges {
				node {
					id
					title
					slug
					yoast {
						...LookbookYoast
					}
					acf {
						link
						gallery {
							...LargeImage
						}
					}
				}
			}
		}
	}
`;
