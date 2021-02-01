import { SelectOption } from '../../../taxonomy.types';

import { TaxonomySelectMethods, TaxonomySelectValue } from './TaxonomySelect.types';

export const INITIAL_TAXONOMY_VALUE: TaxonomySelectValue = {
	taxonomyId: '',
	selectionMethod: '',
};

export const TAXONOMY_DEFAULT_OPTION: SelectOption = {
	label: 'Selecteer een taxonomie',
	value: '',
	disabled: true,
};

export const SELECTION_METHOD_OPTIONS = [
	{
		label: 'Autocomplete',
		value: TaxonomySelectMethods.AutoComplete,
	},
	{
		label: 'Dropdown',
		value: TaxonomySelectMethods.Dropdown,
	},
];
