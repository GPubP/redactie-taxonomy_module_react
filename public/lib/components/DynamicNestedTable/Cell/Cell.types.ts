import { CSSProperties } from 'react';

import { TableColumn } from '../../../taxonomy.types';
import { RowData } from '../DynamicNestedTable.types';

export interface CellProps {
	className?: string;
	style?: CSSProperties;
	classList?: string[];
	component?: TableColumn<RowData>['component'];
	rowData: RowData;
	rowIndex: number;
	value?: number | string | null;
}
