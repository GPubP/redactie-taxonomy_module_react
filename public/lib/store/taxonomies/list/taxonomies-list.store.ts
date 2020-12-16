import { StoreConfig } from '@datorama/akita';
import { CacheEntityStore } from '@redactie/utils';

import { TaxonomiesListState, TaxonomyListModel } from './taxonomies-list.model';

@StoreConfig({ name: 'taxonomies-list', idKey: 'id' })
export class TaxonomiesListStore extends CacheEntityStore<
	any,
	TaxonomiesListState,
	TaxonomyListModel
> {}

export const taxonomiesListStore = new TaxonomiesListStore();
