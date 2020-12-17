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

export interface CreateTaxonomyTermPayloadOptions {
	successAlertContainerId: string;
	errorAlertContainerId: string;
}

export interface UpdateTaxonomyTermPayloadOptions {
	alertContainerId: string;
}
