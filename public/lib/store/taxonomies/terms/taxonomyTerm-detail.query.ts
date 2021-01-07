import { CacheEntityQuery } from '@redactie/utils';

import { TaxonomyTermsDetailState, TaxonomyTermsDetailUIState } from './taxonomyTerm-detail.model';
import { taxonomyTermsDetailStore, TaxonomyTermsDetailStore } from './taxonomyTerm-detail.store';

export class TaxonomyTermsDetailQuery extends CacheEntityQuery<
	TaxonomyTermsDetailUIState,
	TaxonomyTermsDetailState
> {
	constructor(protected store: TaxonomyTermsDetailStore) {
		super(store);
	}
}

export const taxonomyTermsDetailQuery = new TaxonomyTermsDetailQuery(taxonomyTermsDetailStore);
