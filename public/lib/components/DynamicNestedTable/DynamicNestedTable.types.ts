import { OrderBy, TableColumn } from '@redactie/utils';
import { Ref } from 'react';

import { DndItem } from '../../views/TaxonomyDetailTerms/TaxonomyDetailTerms.types';

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
	moveRow?: (
		source: DndItem,
		target: DndItem,
		boundingRect: DOMRect | null,
		clientOffset: XYCoord | null,
		offsetDiff?: XYCoord | null
	) => void;
	noColumnsMessage?: string;
	noDataMessage?: string;
	orderBy?: OrderByFn;
	responsive?: boolean;
	rows?: R[];
	tableClassName?: string;
}

export interface XYCoord {
	x: number;
	y: number;
}

export interface DndDragDroppableChildFnParams {
	dragDropRef: Ref<HTMLDivElement>;
	isDragging: boolean;
}
