import { StoreConfig } from '@datorama/akita';
import { CacheEntityStore } from '@redactie/utils';

import { TaxonomyTermListModel, TaxonomyTermsListState } from './taxonomyTerms-list.model';

@StoreConfig({ name: 'taxonomies-list', idKey: 'id' })
export class TaxonomyTermsListStore extends CacheEntityStore<
	any,
	TaxonomyTermsListState,
	TaxonomyTermListModel,
	number
> {}

export const taxonomyTermsListStore = new TaxonomyTermsListStore();
