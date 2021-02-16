import { CacheEntityState } from '@redactie/utils';

import { Taxonomy } from '../../../services/taxonomies';

export type TaxonomyListModel = Taxonomy;
export type TaxonomyListUIModel = {
	isCreating: boolean;
	isFetching: boolean;
	error?: any;
};

export type TaxonomiesListState = CacheEntityState<TaxonomyListModel, number>;
