import { OrderBy } from '@redactie/utils';
import { is, isNil } from 'ramda';

import { TableColumn } from '../../taxonomy.types';

import { CellProps } from './Cell';
import { RowData } from './DynamicNestedTable.types';
import { HeaderProps } from './Header/Header.types';

const getCellValue = (rowData: RowData, key: string, fallback?: string): string | null => {
	if (!key) {
		return null;
	}

	const value = rowData[key];

	if (is(Object, value)) {
		return String(value);
	}

	if (isNil(value) && fallback) {
		return fallback;
	}

	return value;
};

const getFormatValue = (
	rowData: RowData,
	col: TableColumn<RowData> | string,
	rowIndex: number
): string | null => {
	if (typeof col === 'string') {
		return getCellValue(rowData, col);
	}

	const cellValue = getCellValue(rowData, col.value as string, col.fallback);

	return col.format ? col.format(cellValue, col, rowData, rowIndex) : cellValue;
};

export const getHeaderProps = (
	col: TableColumn<RowData>,
	activeSorting?: OrderBy,
	onSortClick?: HeaderProps['onSortClick']
): HeaderProps => {
	if (typeof col === 'string') {
		return { label: col };
	}

	return {
		component: col.headerComponent,
		classList: col.classList,
		disableSorting: col.disableSorting,
		label: col.label,
		value: col.value,
		width: col.width,
		activeSorting,
		onSortClick,
	};
};

export const getCellProps = (
	col: TableColumn<RowData>,
	rowData: RowData,
	rowIndex: number
): CellProps => {
	const value = getFormatValue(rowData, col, rowIndex);

	if (typeof col === 'string') {
		return { rowData, rowIndex, value };
	}

	return {
		classList: col.classList,
		component: col.component,
		ellipsis: col.ellipsis,
		rowData,
		rowIndex,
		value,
	};
};
