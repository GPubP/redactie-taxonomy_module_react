import { OrderBy, TableColumn } from '@redactie/utils';

import { OrderByFn, RowData } from '../DynamicNestedTable.types';

export interface HeaderProps {
	className?: string;
	classList?: string[];
	label: string;
	value?: string;
	component?: TableColumn<RowData>['headerComponent'];
	disableSorting?: boolean;
	activeSorting?: OrderBy;
	onSortClick?: OrderByFn;
	width?: string;
}
