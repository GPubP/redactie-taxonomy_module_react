import { TableColumn } from '@redactie/utils';
import { CSSProperties } from 'react';

import { RowData } from '../DynamicNestedTable.types';

export interface CellProps {
	className?: string;
	style?: CSSProperties;
	classList?: string[];
	component?: TableColumn<RowData>['component'];
	ellipsis?: boolean;
	rowData: RowData;
	rowIndex: number;
	value?: number | string | null;
}
