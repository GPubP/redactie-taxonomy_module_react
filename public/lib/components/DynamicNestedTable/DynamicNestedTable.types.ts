import { OrderBy } from '@redactie/utils';
import { Ref } from 'react';

import { TableColumn } from '../../taxonomy.types';
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
	moveRow?: (source: DndItem, target: DndItem) => void;
	noColumnsMessage?: string;
	noDataMessage?: string;
	offsetRow?: (
		dragged: DndItem,
		refBoundingRect: DOMRect | null,
		offsetDiff: XYCoord | null
	) => void;
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
