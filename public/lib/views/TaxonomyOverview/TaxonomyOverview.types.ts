export interface OverviewTableRow {
	label: string;
	description: string;
	publishStatus: string;
	settingsPath: string;
	editTerms: () => void;
}
