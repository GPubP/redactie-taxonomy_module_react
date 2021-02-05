import { EllipsisWithTooltip } from '@acpaas-ui/react-editorial-components';
import classnames from 'classnames';
import React, { FC } from 'react';

import { CellProps } from './Cell.types';

const TableCell: FC<CellProps> = ({
	className,
	classList,
	component,
	ellipsis = false,
	rowData,
	rowIndex,
	style,
	value,
}) => (
	<div className={classnames(className, classList)} style={style}>
		{ellipsis ? (
			<EllipsisWithTooltip type="primary">
				{component ? component(value, rowData, rowIndex) : value}
			</EllipsisWithTooltip>
		) : (
			<>{component ? component(value, rowData, rowIndex) : value}</>
		)}
	</div>
);

export default TableCell;
