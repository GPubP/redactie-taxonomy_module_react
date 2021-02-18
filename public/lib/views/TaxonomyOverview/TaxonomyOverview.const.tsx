import { Button } from '@acpaas-ui/react-components';
import { EllipsisWithTooltip } from '@acpaas-ui/react-editorial-components';
import { TranslateFunc } from '@redactie/translations-module';
import { APIQueryParamsConfig } from '@redactie/utils';
import React from 'react';
import { Link } from 'react-router-dom';

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
	sparse: {
		defaultValue: true,
		type: 'boolean',
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
		width: '60%',
		component(label: string, { description, settingsPath }: OverviewTableRow) {
			return (
				<>
					<EllipsisWithTooltip>
						<Link to={settingsPath}>{label}</Link>
					</EllipsisWithTooltip>
					<p className="small">
						{description ? (
							<EllipsisWithTooltip>{description}</EllipsisWithTooltip>
						) : (
							<span className="u-text-italic">
								{t(CORE_TRANSLATIONS['TABLE_NO-DESCRIPTION'])}
							</span>
						)}
					</p>
				</>
			);
		},
	},
	{
		label: t(CORE_TRANSLATIONS.TABLE_STATUS),
		value: 'publishStatus',
		width: '20%',
		component(publishStatus: string) {
			return publishStatus;
		},
	},
	{
		label: '',
		classList: ['u-text-right'],
		disableSorting: true,
		width: '20%',
		component(value: unknown, { editTerms }: OverviewTableRow) {
			return <Button ariaLabel="Edit" icon="edit" onClick={editTerms} transparent />;
		},
	},
];
