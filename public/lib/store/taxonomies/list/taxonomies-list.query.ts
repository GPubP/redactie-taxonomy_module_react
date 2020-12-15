import { combineQueries } from '@datorama/akita';
import { CacheEntityQuery } from '@redactie/utils';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { taxonomiesDetailQuery, TaxonomiesDetailQuery } from '../detail';
import { TaxonomyUIModel } from '../taxonomies.types';

import { TaxonomiesListState } from './taxonomies-list.model';
import { taxonomiesListStore, TaxonomiesListStore } from './taxonomies-list.store';

export class TaxonomiesListQuery extends CacheEntityQuery<any, TaxonomiesListState> {
	constructor(
		protected store: TaxonomiesListStore,
		protected detailQuery: TaxonomiesDetailQuery
	) {
		super(store);
	}

	public taxonomies$ = this.selectAll();

	public getIsFetching(): boolean {
		return this.getValue().isFetching;
	}

	public selectUIState(): Observable<TaxonomyUIModel> {
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

export const taxonomiesListQuery = new TaxonomiesListQuery(
	taxonomiesListStore,
	taxonomiesDetailQuery
);
