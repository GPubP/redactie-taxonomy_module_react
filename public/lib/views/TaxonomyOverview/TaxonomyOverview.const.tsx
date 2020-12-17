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
	pagesize: {
		defaultValue: 10,
		type: 'number',
	},
	label: {
		defaultValue: '',
		type: 'string',
	},
	publishStatus: {
		defaultValue: '',
		type: 'string',
	},
};

export const DEFAULT_FILTER_FORM: FilterFormState = {
	label: '',
	publishStatus: '',
};

export const OVERVIEW_COLUMNS = (t: TranslateFunc): TableColumn<OverviewTableRow>[] => [
	{
		label: t(CORE_TRANSLATIONS.TABLE_NAME),
		value: 'label',
		component(label: string, { description }: OverviewTableRow) {
			return (
				<>
					{label}
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
		value: 'publishStatus',
		component(publishStatus: string) {
			return publishStatus;
		},
	},
	{
		label: '',
		classList: ['u-text-right'],
		disableSorting: true,
		component(value: unknown, { navigate, id }: OverviewTableRow) {
			return (
				<Button
					ariaLabel="Edit"
					icon="edit"
					onClick={() => navigate(MODULE_PATHS.detail, { taxonomyId: id })}
					transparent
				/>
			);
		},
	},
];
