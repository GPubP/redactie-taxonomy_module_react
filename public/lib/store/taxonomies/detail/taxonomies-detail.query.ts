import { CacheEntityQuery } from '@redactie/utils';

import { TaxonomiesDetailState, TaxonomiesDetailUIState } from './taxonomies-detail.model';
import { taxonomiesDetailStore, TaxonomiesDetailStore } from './taxonomies-detail.store';

export class TaxonomiesDetailQuery extends CacheEntityQuery<
	TaxonomiesDetailUIState,
	TaxonomiesDetailState
> {
	constructor(protected store: TaxonomiesDetailStore) {
		super(store);
	}
}

export const taxonomiesDetailQuery = new TaxonomiesDetailQuery(taxonomiesDetailStore);
