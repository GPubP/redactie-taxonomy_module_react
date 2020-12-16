export interface Taxonomy {
	createdAt: string;
	createdBy: string;
	description: string;
	id: number;
	label: string;
	publishStatus: string;
	updatedAt: string;
	updatedBy: string;
}

/**
 * =========================
 * Response types
 * - Define all response interfaces coming from the server
 * =========================
 */

export interface TaxonomiesResponse {
	_embedded: { resourceList: Taxonomy[] };
	_page: {
		number: number;
		size: number;
		totalElements: number;
		totalPages: number;
	};
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
	label: string;
	description: string;
	status: string;
}

export interface UpdateTaxonomyPayload {
	uuid: string;
	label: string;
	description: string;
	status: string;
}
