export interface Taxonomy extends TaxonomySettings {
	createdAt: string;
	createdBy: string;
	id: number;
	updatedAt: string;
	updatedBy: string;
}

export interface TaxonomySettings {
	description: string;
	label: string;
	publishStatus: string;
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

export type CreateTaxonomyPayload = TaxonomySettings;

export type UpdateTaxonomySettingsPayload = {
	id: number;
	body: TaxonomySettings;
};
