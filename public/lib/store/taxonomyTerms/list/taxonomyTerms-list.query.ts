import { combineQueries } from '@datorama/akita';
import { CacheEntityQuery } from '@redactie/utils';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { taxonomyTermsDetailQuery, TaxonomyTermsDetailQuery } from '../detail';
import { TaxonomyTermUIModel } from '../taxonomyTerms.types';

import { TaxonomyTermsListState } from './taxonomyTerms-list.model';
import { taxonomyTermsListStore, TaxonomyTermsListStore } from './taxonomyTerms-list.store';

export class TaxonomyTermListQuery extends CacheEntityQuery<any, TaxonomyTermsListState> {
	constructor(
		protected store: TaxonomyTermsListStore,
		protected detailQuery: TaxonomyTermsDetailQuery
	) {
		super(store);
	}

	public taxonomyTerms$ = this.selectAll();

	public getIsFetching(): boolean {
		return this.getValue().isFetching;
	}

	public selectUIState(): Observable<TaxonomyTermUIModel> {
		return combineQueries([
			this.select(['error', 'isFetching']),
			this.detailQuery.select(['error', 'isCreating']),
		]).pipe(
			map(([globalListUIState, globalDetailState]) => {
				const error = globalListUIState.error || globalDetailState.error;

				return {
					isCreating: globalDetailState.isCreating,
					isFetching: globalListUIState.isFetching,
					error,
				};
			})
		);
	}
}

export const taxonomyTermListQuery = new TaxonomyTermListQuery(
	taxonomyTermsListStore,
	taxonomyTermsDetailQuery
);
