export interface Taxonomy {
	uuid: string;
	_id: string;
	uuid: string;
	meta: {
		label: string;
		safeLabel: string;
		created: string;
	};
	tags: TaxonomyTag[];
}

export interface TaxonomyTag {
	_id: string;
	uuid: string;
	label: {
		multiLanguage: true;
		_LANG_: string;
	};
	safeLabel: string;
}

/**
 * =========================
 * Response types
 * - Define all response interfaces coming from the server
 * =========================
 */

export interface TaxonomiesResponse {
	data: Taxonomy[];
	paging: any;
}

export interface TaxonomyDetailResponse {
	uuid: string;
}

/**
 * =========================
 * Payload types
 * - Define all payload interfaces
 * =========================
 */

export interface CreateTaxonomyPayload {
	meta: {
		label: string;
	};
}

export interface UpdateTaxonomyPayload {
	uuid: string;
	meta: {
		label: string;
	};
}
