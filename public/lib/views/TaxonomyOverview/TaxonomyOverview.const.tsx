import { Button } from '@acpaas-ui/react-components';
import { EllipsisWithTooltip } from '@acpaas-ui/react-editorial-components';
import { TranslateFunc } from '@redactie/translations-module';
import { TableColumn } from '@redactie/utils';
import React from 'react';
import { Link } from 'react-router-dom';

import { FilterFormState } from '../../components';
import { CORE_TRANSLATIONS } from '../../connectors';

import { OverviewTableRow } from './TaxonomyOverview.types';

export const DEFAULT_OVERVIEW_QUERY_PARAMS = {
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
} as const;

export const DEFAULT_FILTER_FORM: FilterFormState = {
	label: '',
	publishStatus: '',
};

export const OVERVIEW_COLUMNS = (t: TranslateFunc): TableColumn<OverviewTableRow>[] => [
	{
		label: t(CORE_TRANSLATIONS.TABLE_NAME),
		value: 'label',
		width: '60%',
		component(label: string, { description, settingsPath }) {
			return (
				<>
					<Link to={settingsPath}>
						<EllipsisWithTooltip>{label}</EllipsisWithTooltip>
					</Link>
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
		component(value, { editTerms }) {
			return <Button ariaLabel="Edit" icon="edit" onClick={editTerms} transparent />;
		},
	},
];
