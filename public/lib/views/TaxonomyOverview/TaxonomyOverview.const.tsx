import { Button } from '@acpaas-ui/react-components';
import { TranslateFunc } from '@redactie/translations-module';
import { APIQueryParamsConfig } from '@redactie/utils';
import React from 'react';

import { FilterFormState } from '../../components';
import { CORE_TRANSLATIONS } from '../../connectors';
import { MODULE_PATHS } from '../../taxonomy.const';
import { TableColumn } from '../../taxonomy.types';

import { OverviewTableRow } from './TaxonomyOverview.types';

export const DEFAULT_OVERVIEW_QUERY_PARAMS: APIQueryParamsConfig = {
	page: {
		defaultValue: 1,
		type: 'number',
	},
	skip: {
		defaultValue: 0,
		type: 'number',
	},
	limit: {
		defaultValue: 10,
		type: 'number',
	},
	search: {
		defaultValue: '',
		type: 'string',
	},
	sort: {
		defaultValue: '',
		type: 'string',
	},
};

export const DEFAULT_FILTER_FORM: FilterFormState = {
	search: '',
	status: '',
};

export const OVERVIEW_COLUMNS = (t: TranslateFunc): TableColumn<OverviewTableRow>[] => [
	{
		label: t(CORE_TRANSLATIONS.TABLE_NAME),
		value: 'name',
		component(name: string, { description }: OverviewTableRow) {
			return (
				<>
					{name}
					{description && (
						<p>
							<small>{description}</small>
						</p>
					)}
				</>
			);
		},
	},
	{
		label: t(CORE_TRANSLATIONS.TABLE_STATUS),
		value: 'status',
		component(status: string) {
			return status;
		},
	},
	{
		label: '',
		classList: ['u-text-right'],
		disableSorting: true,
		component(value: unknown, { navigate, uuid }: OverviewTableRow) {
			return (
				<Button
					ariaLabel="Edit"
					icon="edit"
					onClick={() => navigate(MODULE_PATHS.detail, { taxonomyUuid: uuid })}
					transparent
				/>
			);
		},
	},
];
