export interface SortableTerm<T = unknown> {
	children?: SortableTerm<T>[];
	position: number;
}
