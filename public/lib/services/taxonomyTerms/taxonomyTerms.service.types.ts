import { EmbeddedResponse } from '@redactie/utils';

export interface TaxonomyTerm {
	id: number;
	label: string;
	description: string;
	taxonomyId: number;
	publishStatus: 'published';
	createdBy: string;
	createdAt: string;
	updatedBy: string;
	updatedAt: string;
	propertyValues: TermPropertyValue[];
	parentTermId: number;
	position: number;
}

export interface TermPropertyValue {
	id: number;
	key: string;
	value: string;
}

/**
 * =========================
 * Response types
 * - Define all response interfaces coming from the server
 * =========================
 */

export type TaxonomyTermsResponse = EmbeddedResponse<TaxonomyTerm>;

/**
 * =========================
 * Payload types
 * - Define all payload interfaces
 * =========================
 */

export interface CreateTaxonomyTermPayload {
	label: string;
	description: string;
	publishStatus: string;
	parentTermId?: number;
	propertyValues?: TermPropertyValue[];
}

export interface UpdateTaxonomyTermPayload {
	label: string;
	description: string;
	publishStatus: string;
	parentTermId?: number;
	id: number;
	createdBy: string;
	createdAt: string;
	updatedBy: string;
	updatedAt: string;
	propertyValues?: TermPropertyValue[];
}

export type UpdateTaxonomyTermsPayload = {
	id: number;
	label: string;
	// TODO: allow position once available from backend
	body: Omit<TaxonomyTerm, 'position'>[];
};
