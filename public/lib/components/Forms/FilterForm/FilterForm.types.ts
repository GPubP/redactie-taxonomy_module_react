import { FilterItem } from '../../../taxonomy.types';

export interface FilterFormProps {
	activeFilters: FilterItem[];
	initialState: FilterFormState;
	clearActiveFilter: (item: FilterItem) => void;
	onSubmit: (values: FilterFormState) => void;
	onCancel: () => void;
}

export interface FilterFormState {
	search: string;
	status: string;
}
