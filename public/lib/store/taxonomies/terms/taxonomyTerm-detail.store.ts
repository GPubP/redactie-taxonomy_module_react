import { StoreConfig } from '@datorama/akita';
import { CacheEntityStore } from '@redactie/utils';

import {
	TaxonomyTermDetailModel,
	TaxonomyTermsDetailState,
	TaxonomyTermsDetailUIState,
} from './taxonomyTerm-detail.model';

@StoreConfig({ name: 'taxonomies-terms-detail', idKey: 'id' })
export class TaxonomyTermsDetailStore extends CacheEntityStore<
	TaxonomyTermsDetailUIState,
	TaxonomyTermsDetailState,
	TaxonomyTermDetailModel,
	number
> {}

export const taxonomyTermsDetailStore = new TaxonomyTermsDetailStore();
