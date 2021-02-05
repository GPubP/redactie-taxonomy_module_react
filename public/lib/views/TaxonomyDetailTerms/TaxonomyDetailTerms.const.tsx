import { Button, ButtonGroup } from '@acpaas-ui/react-components';
import { TranslateFunc } from '@redactie/translations-module';
import React from 'react';
import { Link } from 'react-router-dom';

import { CORE_TRANSLATIONS } from '../../connectors';
import { MODULE_PATHS, TENANT_ROOT } from '../../taxonomy.const';
import { TableColumn } from '../../taxonomy.types';

import { DetailTermTableRow, MoveDirection } from './TaxonomyDetailTerms.types';

export const DETAIL_TERMS_COLUMNS = (
	t: TranslateFunc,
	onMoveRow: (termId: number, direction: MoveDirection) => void
): TableColumn<DetailTermTableRow>[] => [
	{
		label: t(CORE_TRANSLATIONS.TABLE_NAME),
		value: 'label',
		disableSorting: true,
		headerComponent(label: string) {
			return <span className="u-padding-left-xx">{label}</span>;
		},
		component(label: string, rowData) {
			const defaultButtonProps = {
				htmlType: 'button',
				size: 'tiny',
				transparent: true,
				negative: true,
			};

			return (
				<div className="u-flex u-flex-align-center u-flex-no-wrap">
					<div className="u-flex u-flex-align-center u-flex-no-wrap">
						<Button
							{...defaultButtonProps}
							onClick={() => onMoveRow(rowData.id, MoveDirection.Left)}
							icon="chevron-left"
							ariaLabel="Move item left"
							disabled={!rowData.canMoveLeft}
						/>
						<ButtonGroup direction="vertical">
							<Button
								{...defaultButtonProps}
								onClick={() => onMoveRow(rowData.id, MoveDirection.Up)}
								icon="chevron-up"
								ariaLabel="Move item up"
								disabled={!rowData.canMoveUp}
							/>
							<Button
								{...defaultButtonProps}
								onClick={() => onMoveRow(rowData.id, MoveDirection.Down)}
								icon="chevron-down"
								ariaLabel="Move item down"
								disabled={!rowData.canMoveDown}
							/>
						</ButtonGroup>
						<Button
							{...defaultButtonProps}
							onClick={() => onMoveRow(rowData.id, MoveDirection.Right)}
							icon="chevron-right"
							ariaLabel="Move item right"
							disabled={!rowData.canMoveRight}
						/>
					</div>
					<div className="u-margin-left u-text-truncate">
						{rowData.path ? <Link to={rowData.path}>{label}</Link> : label}
						<p>
							<small>{rowData.description || <i>Geen beschrijving.</i>}</small>
						</p>
					</div>
				</div>
			);
		},
	},
	{
		label: 'Status',
		value: 'publishStatus',
		disableSorting: true,
	},
	{
		label: '',
		classList: ['u-text-right'],
		disableSorting: true,
		component(value: unknown, { navigate }) {
			return <Button ariaLabel="Edit" icon="edit" onClick={() => navigate()} transparent />;
		},
	},
];

export const DETAIL_TERMS_ALLOWED_PATHS = [
	`${TENANT_ROOT}${MODULE_PATHS.terms.create}`,
	`${TENANT_ROOT}${MODULE_PATHS.terms.detail}`,
];
