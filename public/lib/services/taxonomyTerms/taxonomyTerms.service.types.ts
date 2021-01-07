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
	propertyValues: [];
	parentTermId: number;
}
export type TaxonomyTermsResponse = TaxonomyTerm[];
// export interface TaxonomyTermsResponse {
// 	_embedded: { resourceList: TaxonomyTerm[] };
// }

export interface CreateTaxonomyTermPayload {
	label: string;
	description: string;
	publishStatus: string;
	parentTermId: number;
}

export interface UpdateTaxonomyTermPayload {
	label: string;
	description: string;
	publishStatus: string;
	parentTermId: number;
	id: number;
	createdBy: string;
	createdAt: string;
	updatedBy: string;
	updatedAt: string;
}
