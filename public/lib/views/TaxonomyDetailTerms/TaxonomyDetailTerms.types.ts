export interface DetailTermTableRow {
	canMoveDown: boolean;
	canMoveLeft: boolean;
	canMoveRight: boolean;
	canMoveUp: boolean;
	description: string;
	id: number;
	label: string;
	navigate: () => void;
	path: string;
	publishStatus: string;
	rows: DetailTermTableRow[];
	taxonomyId: number;
}

export enum MoveDirection {
	Up,
	Down,
	Left,
	Right,
}

export interface DndItem {
	id: number;
	index: number;
	type: string;
}
