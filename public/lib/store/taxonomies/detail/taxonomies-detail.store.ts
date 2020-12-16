import { StoreConfig } from '@datorama/akita';
import { CacheEntityStore } from '@redactie/utils';

import {
	TaxonomiesDetailState,
	TaxonomiesDetailUIState,
	TaxonomyDetailModel,
} from './taxonomies-detail.model';

@StoreConfig({ name: 'taxonomies-detail', idKey: 'uuid' })
export class TaxonomiesDetailStore extends CacheEntityStore<
	TaxonomiesDetailUIState,
	TaxonomiesDetailState,
	TaxonomyDetailModel
> {}

export const taxonomiesDetailStore = new TaxonomiesDetailStore();
