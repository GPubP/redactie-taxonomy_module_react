import { Button } from '@acpaas-ui/react-components';
import { TranslateFunc } from '@redactie/translations-module';
import React from 'react';

import { CORE_TRANSLATIONS } from '../../connectors';
import { MODULE_PATHS } from '../../taxonomy.const';
import { TableColumn } from '../../taxonomy.types';

import { DetailTermTableRow } from './TaxonomyDetailTerms.types';

export const DETAIL_TERMS_COLUMNS = (t: TranslateFunc): TableColumn<DetailTermTableRow>[] => [
	{
		label: t(CORE_TRANSLATIONS.TABLE_NAME),
		value: 'label',
		disableSorting: true,
		component(label: string, { description }: DetailTermTableRow) {
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
		label: '',
		classList: ['u-text-right'],
		disableSorting: true,
		component(value: unknown, { navigate, id, taxonomyId }: DetailTermTableRow) {
			return (
				<Button
					ariaLabel="Edit"
					icon="edit"
					onClick={() => navigate(MODULE_PATHS.terms.detail, { taxonomyId, termId: id })}
					transparent
				/>
			);
		},
	},
];
