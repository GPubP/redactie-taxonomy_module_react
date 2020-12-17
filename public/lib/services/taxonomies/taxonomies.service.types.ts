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

export type TaxonomyDetailResponse = Taxonomy;

/**
 * =========================
 * Payload types
 * - Define all payload interfaces
 * =========================
 */

export interface CreateTaxonomyPayload {
	label: string;
	description: string;
	publishStatus: string;
}

export interface UpdateTaxonomyPayload {
	id: number;
	label: string;
	description: string;
	publishStatus: string;
}
