import { NavigateFn } from '@redactie/utils';

export interface OverviewTableRow {
	id: number;
	name: string;
	description: string;
	publishStatus: string;
	navigate: NavigateFn;
}
