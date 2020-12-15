import { NavigateFn } from '@redactie/utils';

export interface OverviewTableRow {
	uuid: string;
	name: string;
	description: string;
	status: string;
	navigate: NavigateFn;
}
