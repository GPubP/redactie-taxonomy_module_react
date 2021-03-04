import {
	DndContainer,
	DndDragDroppable,
	getCellProps,
	getHeaderProps,
	TableCell,
	TableHeader,
	TablePlaceholder,
} from '@acpaas-ui/react-editorial-components';
import { TableColumn } from '@redactie/utils';
import classnames from 'classnames/bind';
import { path } from 'ramda';
import React, { FC, Fragment, ReactElement } from 'react';

import { DEFAULT_MESSAGES, DND_ITEM_TYPE, INDENT_SIZE } from './DynamicNestedTable.const';
import styles from './DynamicNestedTable.module.scss';
import {
	DndDragDroppableChildFnParams,
	DynamicNestedTableProps,
	RowData,
} from './DynamicNestedTable.types';
import { Loader } from './Loader';
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
	const showPlaceholder = (!hasCols || !hasData) && !loading;

	/**
	 * Methods
	 */

	const getCellKey = (prefix: string, col: TableColumn<RowData>, colIndex: number): string => {
		// Make sure no duplicate keys are made when multiple cols have no label
		const suffix = typeof col === 'string' && col ? col : col.label ? col.label : colIndex;
		return `${prefix}-${suffix}`;
	};

	/**
	 * Render
	 */

	const renderCell = (
		col: TableColumn<RowData>,
		colIndex: number,
		row: RowData,
		rowIndex: number,
		level = 1
	): ReactElement => {
		const indentStyle = { borderLeft: `${(level - 1) * (INDENT_SIZE / 16)}rem solid white` };

		return (
			<TableCell
				{...getCellProps(col, row, rowIndex)}
				key={getCellKey('cell', col, colIndex)}
				as="div"
				className={cx('o-dynamic-nested-table__cell')}
				style={colIndex === 0 && level > 1 ? indentStyle : {}}
			/>
		);
	};

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
				key={`table-row-${id}`}
				allowHorizontalDrag
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
										isDragging || parentIsDragging
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

	const renderTable = (): ReactElement => {
		return (
			<DndContainer draggable={draggable}>
				<div className={cx(className, { 'o-dynamic-nested-table-responsive': responsive })}>
					<div
						className={cx('o-dynamic-nested-table', tableClassName, {
							'o-dynamic-nested-table--draggable': draggable,
							'o-dynamic-nested-table--fixed': fixed,
						})}
					>
						<div className={cx('o-dynamic-nested-table__head')}>
							<Row className={cx('o-dynamic-nested-table__row')}>
								{columns.map((col, colIndex) => (
									<TableHeader
										{...getHeaderProps(col, activeSorting, orderBy)}
										key={getCellKey('header', col, colIndex)}
										as="div"
										className={cx('o-dynamic-nested-table__cell')}
									/>
								))}
							</Row>
						</div>
						<div className={cx('o-dynamic-nested-table__body')}>
							{loading ? (
								<Loader loadDataMessage={loadDataMessage} />
							) : (
								rows.map((row, index) => renderTableRow(row, index))
							)}
						</div>
					</div>
				</div>
			</DndContainer>
		);
	};

	return showPlaceholder ? (
		<TablePlaceholder
			className={className}
			hasCols={hasCols}
			hasData={hasData}
			noDataMessage={noDataMessage}
			noColumnsMessage={noColumnsMessage}
		/>
	) : (
		renderTable()
	);
};

export default DynamicNestedTable;
