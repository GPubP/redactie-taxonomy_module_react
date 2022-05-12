import { EmbeddedResponse } from '@redactie/utils';

import { TaxonomyTerm } from '../taxonomyTerms';

export interface Taxonomy extends TaxonomySettings {
	createdAt: string;
	createdBy: string;
	id: number;
	updatedAt: string;
	updatedBy: string;
	terms: TaxonomyTerm[];
}

export interface TaxonomySettings {
	description: string;
	label: string;
	publishStatus: string;
	multiLanguage: boolean;
}

/**
 * =========================
 * Response types
 * - Define all response interfaces coming from the server
 * =========================
 */

export type TaxonomiesResponse = EmbeddedResponse<Taxonomy>;
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
