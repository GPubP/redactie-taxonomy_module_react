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

export interface TaxonomyTermUIModel {
	isFetching: boolean;
	isCreating: boolean;
	error?: any;
}

export interface GetTaxonomyTermsPayloadOptions {
	alertContainerId: string;
}

export interface GetTaxonomyTermsPaginatedPayloadOptions {
	clearCache?: boolean;
	alertContainerId?: string;
}

export interface GetTaxonomyTermPayloadOptions {
	force?: boolean;
	alertContainerId?: string;
}

export interface TaxonomyTermPayloadOptions {
	successAlertContainerId: string;
	errorAlertContainerId: string;
}
