import React, {Component} from 'react';
import PropTypes from 'prop-types';
import * as ImmutablePropTypes from 'react-immutable-proptypes';
import {List, fromJS} from 'immutable';
import InfiniteScroll from 'react-infinite-scroller';

import {noop, click} from '../utils/componentHelpers';
import CSS from '../css/modules/imageGrid.module.scss';

const SmallMax = 450;
const MediumMax = 1000;
const LargeMax = 1200;

export default class ImageGrid extends Component {
	constructor(props) {
		super(props);

		this.state = {
			rows: List(),
			items: List()
		};

		this.getRows = this.getRows.bind(this);
		this.getItems = this.getItems.bind(this);
		this.getGrid = this.getGrid.bind(this);
	}

	static propTypes = {
		items: ImmutablePropTypes.list.isRequired,
		placeholders: PropTypes.array,
		component: PropTypes.func.isRequired,
		hasMore: PropTypes.bool.isRequired,
		onLoadMore: PropTypes.func.isRequired,
		onImageClick: PropTypes.func,
		windowWidth: PropTypes.number.isRequired
	};

	static defaultProps = {
		placeholders: [],
		onImageClick: noop
	};

	componentDidMount() {
		this.setNewItems(this.props.items);
	}

	componentWillReceiveProps(nextProps) {
		const prevWidth = this.props.windowWidth;
		const nextWidth = nextProps.windowWidth;

		if (!nextProps.items.equals(this.props.items) || prevWidth !== nextWidth) {
			this.setNewItems(nextProps.items);
		}
	}

	setNewItems(items) {
		const newRows = this.getRows({
			windowWidth: document.body.clientWidth,
			items: items
		});

		this.setState(prevState => {
			return {
				...prevState,
				rows: newRows,
				items: this.getItems(newRows)
			};
		});
	}

	getColumnsPerRow(windowWidth = typeof document === 'undefined' ? 0 : document.body.clientWidth) {
		if (windowWidth > LargeMax) {
			return 6;
		}

		if (windowWidth > MediumMax) {
			return 4;
		}

		if (windowWidth > SmallMax) {
			return 2;
		}

		return 1;
	}

	findAvailableRow(windowWidth, rows, item) {
		const columnsPerRow = this.getColumnsPerRow(windowWidth);

		const index = rows.findIndex(r => {
			if (r && r.count() < columnsPerRow) {
				const rowWidth = this.getRowWidth(r);
				const availableSpace = windowWidth - rowWidth;

				if (availableSpace > 0 && availableSpace >= item.get('width')) {
					return r;
				}

				return false;
			}

			return false;
		});

		return index;
	}

	getRowWidth(row) {
		return row.reduce((width, i) => {
			width += i.get('width');
			return width;
		}, 0);
	}

	isOneColumn() {
		return this.getColumnsPerRow() === 1;
	}

	getRows({windowWidth = typeof document === 'undefined' ? 0 : document.body.clientWidth, items = this.props.items}) {
		const columnHeight = windowWidth / this.getColumnsPerRow();

		items = items.map(item => {
			const ratio = item.get('height') / item.get('width');
			const newWidth = columnHeight / ratio;
			item = item.set('width', newWidth).set('height', columnHeight);

			return item;
		});

		// Build rows and fill them as best as possible
		let rows = items.reduce((list, item) => {
			let rowIndex = this.findAvailableRow(windowWidth, list, item);
			let currentRow;

			if (rowIndex === -1) {
				currentRow = List();
				list = list.push(currentRow);
				rowIndex = list.count() - 1;
			} else {
				currentRow = list.get(rowIndex);
			}

			currentRow = currentRow.push(item);

			return list.set(rowIndex, currentRow);
		}, List());

		// Stretch the rows so that they render 100% of the window
		rows = rows.map((row, index) => {
			const rowWidth = this.getRowWidth(row);
			const rowHeight = row.first().get('height');
			const rowRatio = rowWidth / rowHeight;
			const newHeight = windowWidth / rowRatio;

			// If it is the last row and the row is not full, then don't try to stretch it
			if (index + 1 === rows.count() && row.count() < this.getColumnsPerRow(windowWidth)) {
				return row;
			}

			return this.resizeItems(row, newHeight);
		});

		return rows;
	}

	getRowHeight(row, windowWidth, step = 0.1) {
		let rowWidth = this.getRowWidth(row);
		let rowHeight = row.first().get('height');

		do {
			row = this.resizeItems(row, rowHeight);
			rowWidth = this.getRowWidth(row);
			rowHeight += step;
		} while (rowWidth < windowWidth);

		return rowHeight;
	}

	resizeItems(row, height) {
		return row.map(i => {
			const ratio = i.get('height') / i.get('width');
			const newHeight = height;
			const newWidth = newHeight / ratio;

			return fromJS({
				...i.toJS(),
				height: newHeight,
				width: newWidth
			});
		});
	}

	getItems(rows) {
		let gridHeight = 0;

		return rows.reduce((list, r) => {
			const rowHeight = r.first().get('height');
			let currentLeft = 0;
			let rowTop = gridHeight;

			r.forEach(i => {
				const prevPosition = i.get('position');

				list = list.push(
					fromJS({
						...i.toJS(),
						prevPosition,
						position: [currentLeft, rowTop]
					})
				);
				currentLeft += i.get('width');
			});

			gridHeight += rowHeight;

			return list;
		}, List());
	}

	getGrid() {
		const windowWidth = typeof document === 'undefined' ? 0 : document.body.clientWidth;
		const {rows} = this.state;

		let gridHeight = 0;
		let gridWidth = windowWidth;

		const positions = rows.reduce((list, r) => {
			const rowHeight = r.first().get('height');
			let currentLeft = 0;
			let rowTop = gridHeight;

			r.forEach(i => {
				list = list.push(fromJS([currentLeft, rowTop]));
				currentLeft += i.get('width');
			});

			gridHeight += rowHeight;

			return list;
		}, List());

		return {
			positions: positions.toJS(),
			gridHeight,
			gridWidth
		};
	}

	render() {
		const {component, hasMore, onLoadMore: handleLoadMore} = this.props;
		let {items} = this.state;

		const gridStyle = this.getGrid();
		const isOneColumn = this.isOneColumn();
		const ulStyle = {
			height: isOneColumn ? 'auto' : gridStyle.gridHeight,
			width: isOneColumn ? '100%' : gridStyle.gridWidth,
			whiteSpace: isOneColumn ? 'normal' : 'nowrap'
		};

		return (
			<div className={CSS.grid}>
				<InfiniteScroll pageStart={1} initialLoad={false} loadMore={handleLoadMore} threshold={200} hasMore={hasMore}>
					<ul className={CSS.list} style={ulStyle}>
						{items.map(item => {
							const [transformX, transformY] = item.get('position') ? item.get('position').toJS() : [0, 0];

							const style = {
								opacity: 1,
								display: isOneColumn ? 'block' : 'inline-block',
								transform: isOneColumn ? `translate3d(0, 0, 0)` : `translate3d(${transformX}px, ${transformY}px, 0)`,
								width: isOneColumn ? '100%' : item.get('width'),
								height: isOneColumn ? 'auto' : item.get('height'),
								position: isOneColumn ? 'relative' : 'absolute',
								overflow: 'hidden'
							};

							return (
								<li key={item.get('key')} className={CSS.item} style={style} onClick={click(this.props.onImageClick, item.data)}>
									{React.createElement(component, {...item.toJS()})}
								</li>
							);
						})}
					</ul>
				</InfiniteScroll>
			</div>
		);
	}
}
