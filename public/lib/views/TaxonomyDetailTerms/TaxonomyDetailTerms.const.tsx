import { Button } from '@acpaas-ui/react-components';
import { EllipsisWithTooltip } from '@acpaas-ui/react-editorial-components';
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
		width: '80%',
		component(label: string, { description }: DetailTermTableRow) {
			return (
				<>
					<EllipsisWithTooltip>{label}</EllipsisWithTooltip>
					{description && (
						<p>
							<small>
								<EllipsisWithTooltip>{description}</EllipsisWithTooltip>
							</small>
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
		width: '20%',
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
