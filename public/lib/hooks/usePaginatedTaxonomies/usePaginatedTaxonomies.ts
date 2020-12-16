import { PaginationResponse } from '@datorama/akita';
import { SearchParams, useObservable, usePrevious } from '@redactie/utils';
import { equals, omit } from 'ramda';
import { useEffect, useState } from 'react';
import { combineLatest, Subject } from 'rxjs';
import { filter, switchMap, tap } from 'rxjs/operators';

import { taxonomiesFacade, TaxonomyListModel } from '../../store/taxonomies';

import { UsePaginatedTaxonomies } from './usePaginatedTaxonomies.types';

const paginator = taxonomiesFacade.listPaginator;
const subject = new Subject<SearchParams>();
const searchParamsObservable = subject.asObservable();

const usePaginatedTaxonomies: UsePaginatedTaxonomies = (searchParams, clearCache = false) => {
	const [pagination, setPagination] = useState<PaginationResponse<TaxonomyListModel> | null>(
		null
	);
	const prevSearchParams = usePrevious<SearchParams>(searchParams);
	const loading = useObservable(taxonomiesFacade.isFetching$, true);
	const error = useObservable(taxonomiesFacade.listError$, null);

	useEffect(() => {
		const s = combineLatest([paginator.pageChanges, searchParamsObservable])
			.pipe(
				filter(([page, searchParams]) => {
					if (taxonomiesFacade.getIsFetching()) {
						return false;
					}

					return page === searchParams.page;
				}),
				tap(() => taxonomiesFacade.setIsFetching(true)),
				switchMap(([, searchParams]) =>
					paginator.getPage(() => taxonomiesFacade.getTaxonomiesPaginated(searchParams))
				)
			)
			.subscribe(result => {
				if (result) {
					setPagination(result);
					taxonomiesFacade.setIsFetching(false);
				}
			});

		return () => {
			s.unsubscribe();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (equals(searchParams, prevSearchParams)) {
			return;
		}

		if (
			searchParams.sort !== prevSearchParams?.sort ||
			searchParams.search !== prevSearchParams?.search ||
			clearCache
		) {
			paginator.clearCache();
		}

		subject.next(searchParams);

		if (searchParams.page !== prevSearchParams?.page) {
			paginator.setPage(searchParams.page ?? 1);
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		clearCache,
		prevSearchParams,
		searchParams,
		searchParams.page,
		searchParams.search,
		searchParams.sort,
	]);

	return {
		loading,
		pagination,
		refreshCurrentPage: paginator.refreshCurrentPage.bind(paginator),
		error,
	};
};

export default usePaginatedTaxonomies;
