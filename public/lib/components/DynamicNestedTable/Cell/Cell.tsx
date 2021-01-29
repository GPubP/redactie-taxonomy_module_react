import classnames from 'classnames';
import React, { FC } from 'react';

import { CellProps } from './Cell.types';

const TableCell: FC<CellProps> = ({
	className,
	classList,
	component,
	rowData,
	rowIndex,
	style,
	value,
}) => (
	<div className={classnames(className, classList)} style={style}>
		{component ? component(value, rowData, rowIndex) : value}
	</div>
);

export default TableCell;
