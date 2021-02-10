import { Ref } from 'react';

export interface RowProps {
	className?: string;
	collapseOnDrag?: boolean;
	innerRef?: Ref<HTMLDivElement>;
	isDragging?: boolean;
	level?: number;
}
