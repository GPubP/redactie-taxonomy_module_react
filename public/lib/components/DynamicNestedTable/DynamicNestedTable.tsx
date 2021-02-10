import { Spinner } from '@acpaas-ui/react-components';
import { DndContainer, DndDragDroppable } from '@acpaas-ui/react-editorial-components';
import classnames from 'classnames/bind';
import { path } from 'ramda';
import React, { FC, Fragment, ReactElement } from 'react';

import { TableColumn } from '../../taxonomy.types';

import { Cell } from './Cell';
import { DEFAULT_MESSAGES, DND_ITEM_TYPE } from './DynamicNestedTable.const';
import styles from './DynamicNestedTable.module.scss';
import {
	DndDragDroppableChildFnParams,
	DynamicNestedTableProps,
	RowData,
} from './DynamicNestedTable.types';
import { getCellProps, getHeaderProps } from './DynamicNestedTable.utils';
import { Header } from './Header';
import { Row } from './Row';

const cx = classnames.bind(styles);

const DynamicNestedTable: FC<DynamicNestedTableProps> = ({
	activeSorting,
	className,
	columns = [],
	dataKey,
	draggable = true,
	fixed = false,
	loadDataMessage = DEFAULT_MESSAGES.loading,
	loading = false,
	moveRow = () => null,
	noColumnsMessage = DEFAULT_MESSAGES.noCols,
	noDataMessage = DEFAULT_MESSAGES.noData,
	orderBy,
	responsive = true,
	rows = [],
	tableClassName,
}) => {
	const hasCols = !loading && columns.length > 0;
	const hasData = !loading && rows.length > 0;
	const showPlaceholder = loading || !hasCols || !hasData;

	/**
	 * Render
	 */

	const getCellKey = (prefix: string, col: TableColumn<RowData>, colIndex: number): string => {
		// Make sure no duplicate keys are made when multiple cols have no label
		const suffix = typeof col === 'string' && col ? col : col.label ? col.label : colIndex;
		return `${prefix}-${suffix}`;
	};

	const renderCell = (
		col: TableColumn<RowData>,
		colIndex: number,
		row: RowData,
		rowIndex: number,
		level = 1
	): ReactElement => {
		const indentStyle = { borderLeft: `${(level - 1) * 1.5}rem solid white` };

		return (
			<Cell
				{...getCellProps(col, row, rowIndex)}
				key={getCellKey('cell', col, colIndex)}
				className={cx('o-dynamic-nested-table__cell')}
				style={colIndex === 0 && level > 1 ? indentStyle : {}}
			/>
		);
	};

	const renderPlaceholder = (): ReactElement => (
		<p>
			{loading && (
				<>
					{loadDataMessage}
					<Spinner style={{ display: 'inline' }} />
				</>
			)}
			{!loading && !hasCols && noColumnsMessage}
			{!loading && !hasData && noDataMessage}
		</p>
	);

	const renderDraggableRow = (
		row: RowData,
		rowIndex: number,
		level: number,
		collapse = false,
		parentIsDragging = false
	): ReactElement => {
		const id = path([dataKey as string])(row);

		return (
			<DndDragDroppable
				// Key can NOT be based on index because this will cause issues with react-dnd's
				// ability to set the current item which is being dragged over/hovered
				key={`table-row-${level}-${id}`}
				id={id}
				moveRow={moveRow}
				index={rowIndex}
				accept={[DND_ITEM_TYPE]}
			>
				{({ dragDropRef, isDragging }: DndDragDroppableChildFnParams) => (
					<>
						<Row
							className={cx('o-dynamic-nested-table__row')}
							collapseOnDrag={collapse}
							isDragging={isDragging}
							level={level}
							innerRef={dragDropRef}
						>
							{columns.map((col, colIndex) =>
								renderCell(col, colIndex, row, rowIndex, level)
							)}
						</Row>
						{row?.rows?.length
							? row.rows.map((subRow: RowData, subRowIndex: number) =>
									renderDraggableRow(
										subRow,
										subRowIndex,
										level + 1,
										level >= 1 && (isDragging || parentIsDragging),
										isDragging
									)
							  )
							: null}
					</>
				)}
			</DndDragDroppable>
		);
	};

	const renderStaticRow = (row: RowData, rowIndex: number, level: number): ReactElement => {
		return (
			<Fragment key={`table-row-${level}-${rowIndex}`}>
				<Row className={cx('o-dynamic-nested-table__row')} level={level}>
					{columns.map((col, colIndex) =>
						renderCell(col, colIndex, row, rowIndex, level)
					)}
				</Row>
				{row?.rows?.length
					? row.rows.map((subRow: RowData, subRowIndex: number) =>
							renderStaticRow(subRow, subRowIndex, level + 1)
					  )
					: null}
			</Fragment>
		);
	};

	const renderTableRow = (row: RowData, rowIndex: number, level = 1): ReactElement => {
		return draggable
			? renderDraggableRow(row, rowIndex, level)
			: renderStaticRow(row, rowIndex, level);
	};

	return (
		<DndContainer draggable={draggable}>
			<div className={cx(className, { 'o-dynamic-nested-table-responsive': responsive })}>
				<div
					className={cx('o-dynamic-nested-table', tableClassName, {
						'o-dynamic-nested-table--fixed': fixed,
					})}
				>
					{showPlaceholder ? (
						renderPlaceholder()
					) : (
						<>
							<div className={cx('o-dynamic-nested-table__head')}>
								<Row className={cx('o-dynamic-nested-table__row')}>
									{columns.map((col, colIndex) => (
										<Header
											{...getHeaderProps(col, activeSorting, orderBy)}
											key={getCellKey('header', col, colIndex)}
											className={cx('o-dynamic-nested-table__cell')}
										/>
									))}
								</Row>
							</div>
							<div className={cx('o-dynamic-nested-table__body')}>
								{rows.map((row, index) => renderTableRow(row, index))}
							</div>
						</>
					)}
				</div>
			</div>
		</DndContainer>
	);
};

export default DynamicNestedTable;
