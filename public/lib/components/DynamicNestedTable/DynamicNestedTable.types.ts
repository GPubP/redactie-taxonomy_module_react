import { OrderBy } from '@redactie/utils';
import { Ref } from 'react';

import { TableColumn } from '../../taxonomy.types';

export type RowData = Record<string, any>;
export type OrderByFn = (key: OrderBy['key'], order: OrderBy['order']) => void;

export interface DynamicNestedTableProps<R = RowData> {
	activeSorting?: OrderBy;
	className?: string;
	columns?: TableColumn<R>[];
	dataKey?: string;
	draggable?: boolean;
	fixed?: boolean;
	loadDataMessage?: string;
	loading?: boolean;
	moveRow?: (source: any, target: any) => void;
	noColumnsMessage?: string;
	noDataMessage?: string;
	orderBy?: OrderByFn;
	responsive?: boolean;
	rows?: R[];
	tableClassName?: string;
}

export interface DndDragDroppableChildFnParams {
	dragDropRef: Ref<HTMLDivElement>;
	isDragging: boolean;
}
