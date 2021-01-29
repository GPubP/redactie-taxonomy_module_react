import classnames from 'classnames';
import React, { FC } from 'react';

import { RowProps } from './Row.types';

const Row: FC<RowProps> = ({ children, className, collapseOnDrag, isDragging, innerRef }) => (
	<div
		ref={innerRef}
		className={classnames(className, {
			'is-hovered': isDragging,
			'is-collapsed': collapseOnDrag,
		})}
	>
		{children}
	</div>
);

export default Row;
