import { NavigateFn } from '@redactie/utils';

export interface OverviewTableRow {
	id: number;
	label: string;
	description: string;
	publishStatus: string;
	navigate: NavigateFn;
}
