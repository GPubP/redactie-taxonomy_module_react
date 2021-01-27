export interface TaxonomySelectValue {
	taxonomyId: string;
	selectionMethod: TaxonomySelectMethods | '';
}

export enum TaxonomySelectMethods {
	AutoComplete = 'autocomplete',
	Cascader = 'cascader',
	Dropdown = 'dropdown',
}
