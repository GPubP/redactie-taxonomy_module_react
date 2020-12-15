export interface TaxonomyUIModel {
	isFetching: boolean;
	isCreating: boolean;
	error?: any;
}

export interface GetTaxonomiesPayloadOptions {
	alertContainerId: string;
}

export interface GetTaxonomiesPaginatedPayloadOptions {
	clearCache?: boolean;
	alertContainerId?: string;
}

export interface GetTaxonomyPayloadOptions {
	force?: boolean;
	alertContainerId?: string;
}

export interface CreateTaxonomyPayloadOptions {
	successAlertContainerId: string;
	errorAlertContainerId: string;
}

export interface UpdateTaxonomyPayloadOptions {
	alertContainerId: string;
}
