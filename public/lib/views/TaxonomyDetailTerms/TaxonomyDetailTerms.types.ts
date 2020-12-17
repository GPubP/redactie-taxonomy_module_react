import { NavigateFn } from '@redactie/utils';

export interface DetailTermTableRow {
	id: number;
	taxonomyId: number;
	label: string;
	description: string;
	navigate: NavigateFn;
}
