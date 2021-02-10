import { Button, ButtonGroup } from '@acpaas-ui/react-components';
import { EllipsisWithTooltip } from '@acpaas-ui/react-editorial-components';
import { TranslateFunc } from '@redactie/translations-module';
import { lensProp } from 'ramda';
import React from 'react';
import { Link } from 'react-router-dom';

import { CORE_TRANSLATIONS } from '../../connectors';
import { MODULE_PATHS, TENANT_ROOT } from '../../taxonomy.const';
import { TableColumn } from '../../taxonomy.types';

import { DetailTermTableRow, MoveDirection } from './TaxonomyDetailTerms.types';

export const PARENT_TERM_ID_LENS = lensProp('parentTermId');
export const POSITION_LENS = lensProp('position');

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
		width: '60%',
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
					{/* We need to specify a width for the ellipsis overflow to work in a flex
					context: 4.5rem(width of arrow buttons) + 1.5rem (margin) = 6rem */}
					<div className="u-margin-left" style={{ width: 'calc(100% - 6rem)' }}>
						<EllipsisWithTooltip>
							{<Link to={rowData.path}>{label}</Link>}
						</EllipsisWithTooltip>
						<p className="small">
							{rowData.description ? (
								<EllipsisWithTooltip>{rowData.description}</EllipsisWithTooltip>
							) : (
								<span className="u-text-italic">
									{t(CORE_TRANSLATIONS['TABLE_NO-DESCRIPTION'])}
								</span>
							)}
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
		width: '20%',
	},
	{
		label: '',
		classList: ['u-text-right'],
		disableSorting: true,
		width: '20%',
		component(value: unknown, { navigate }) {
			return <Button ariaLabel="Edit" icon="edit" onClick={() => navigate()} transparent />;
		},
	},
];

export const DETAIL_TERMS_ALLOWED_PATHS = [
	`${TENANT_ROOT}${MODULE_PATHS.terms.create}`,
	`${TENANT_ROOT}${MODULE_PATHS.terms.detail}`,
];
