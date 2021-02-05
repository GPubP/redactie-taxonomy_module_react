import { Button } from '@acpaas-ui/react-components';
import {
	Container,
	ContextHeader,
	ContextHeaderActionsSection,
	ContextHeaderTopSection,
	PaginatedTable,
} from '@acpaas-ui/react-editorial-components';
import { ModuleRouteConfig, useBreadcrumbs } from '@redactie/redactie-core';
import {
	DataLoader,
	OrderBy,
	parseOrderByToString,
	parseStringToOrderBy,
	useAPIQueryParams,
	useNavigate,
	useRoutes,
} from '@redactie/utils';
import React, { FC, ReactElement, useEffect, useState } from 'react';

import { FilterForm, FilterFormState } from '../../components';
import { CORE_TRANSLATIONS, useCoreTranslation } from '../../connectors';
import { usePaginatedTaxonomies } from '../../hooks';
import { BREADCRUMB_OPTIONS, MODULE_PATHS } from '../../taxonomy.const';
import { FilterItem, TaxonomyRouteProps } from '../../taxonomy.types';

import {
	DEFAULT_FILTER_FORM,
	DEFAULT_OVERVIEW_QUERY_PARAMS,
	OVERVIEW_COLUMNS,
} from './TaxonomyOverview.const';
import { OverviewTableRow } from './TaxonomyOverview.types';

const TaxonomyOverview: FC<TaxonomyRouteProps> = () => {
	/**
	 * Hooks
	 */

	const [initialLoading, setInitialLoading] = useState(true);
	const [filterFormState, setFilterFormState] = useState<FilterFormState>(DEFAULT_FILTER_FORM);

	const [query, setQuery] = useAPIQueryParams(DEFAULT_OVERVIEW_QUERY_PARAMS);
	const [t] = useCoreTranslation();
	const { generatePath, navigate } = useNavigate();
	const routes = useRoutes();
	const breadcrumbs = useBreadcrumbs(
		routes as ModuleRouteConfig[],
		BREADCRUMB_OPTIONS(generatePath)
	);
	const { loading, pagination } = usePaginatedTaxonomies(query);

	// Set initial loading
	useEffect(() => {
		if (initialLoading && !loading) {
			setInitialLoading(false);
		}
	}, [initialLoading, loading]);

	// Set initial values with query params
	useEffect(() => {
		const { label = '', publishStatus = '' } = query;

		if (label || publishStatus) {
			setFilterFormState({ label, publishStatus });
		}
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	/**
	 * Methods
	 */

	const createFilters = (values: FilterFormState): FilterItem[] => {
		return [
			{
				key: 'label',
				valuePrefix: 'Zoekterm',
				value: values.label,
			},
			{
				key: 'publishStatus',
				valuePrefix: 'Status',
				value: values.publishStatus,
			},
		].filter(f => !!f.value);
	};

	const clearAllFilters = (): void => {
		setQuery({ label: '', publishStatus: '' });
		setFilterFormState(DEFAULT_FILTER_FORM);
	};

	const clearFilter = (item: FilterItem): void => {
		setQuery({ [item.key]: '' });
		setFilterFormState({
			...filterFormState,
			[item.key]: '',
		});
	};

	const onPageChange = (page: number): void => {
		setQuery({ page });
	};

	const onOrderBy = (orderBy: OrderBy): void => {
		setQuery({ sort: parseOrderByToString(orderBy) });
	};

	const onApplyFilters = (values: FilterFormState): void => {
		setFilterFormState(values);
		setQuery(values);
	};

	const activeSorting = parseStringToOrderBy(query.sort);
	const activeFilters = createFilters(filterFormState);

	/**
	 * Render
	 */

	const renderOverview = (): ReactElement | null => {
		if (!pagination?.data.length) {
			return null;
		}

		const customTaxonomyRows: OverviewTableRow[] = pagination.data.map(taxonomy => ({
			id: taxonomy.id,
			label: taxonomy.label,
			description: taxonomy.description,
			publishStatus: taxonomy.publishStatus,
			navigate,
		}));

		return (
			<>
				<div className="u-margin-top">
					<FilterForm
						initialState={filterFormState}
						onCancel={clearAllFilters}
						onSubmit={onApplyFilters}
						clearActiveFilter={clearFilter}
						activeFilters={activeFilters}
					/>
				</div>
				<PaginatedTable
					fixed
					className="u-margin-top"
					tableClassName="a-table--fixed--xs"
					columns={OVERVIEW_COLUMNS(t)}
					rows={customTaxonomyRows}
					currentPage={pagination?.currentPage || 1}
					itemsPerPage={query.pagesize}
					onPageChange={onPageChange}
					orderBy={onOrderBy}
					activeSorting={activeSorting}
					totalValues={pagination?.total || 0}
					loading={loading}
				/>
			</>
		);
	};

	return (
		<>
			<ContextHeader title="Taxonomie">
				<ContextHeaderTopSection>{breadcrumbs}</ContextHeaderTopSection>
				<ContextHeaderActionsSection>
					<Button iconLeft="plus" onClick={() => navigate(MODULE_PATHS.create)}>
						{t(CORE_TRANSLATIONS['BUTTON_CREATE-NEW'])}
					</Button>
				</ContextHeaderActionsSection>
			</ContextHeader>
			<Container>
				<DataLoader loadingState={initialLoading} render={renderOverview} />
			</Container>
		</>
	);
};

export default TaxonomyOverview;
