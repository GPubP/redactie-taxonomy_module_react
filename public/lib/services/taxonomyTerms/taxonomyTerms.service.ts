import { api } from '../api';

import { TAXONOMIES_PREFIX_URL } from './taxonomyTerms.service.const';
import {
	CreateTaxonomyTermPayload,
	TaxonomyTerm,
	TaxonomyTermsResponse,
	UpdateTaxonomyTermPayload,
} from './taxonomyTerms.service.types';

export class TaxonomyTermsApiService {
	public async getTerms(taxonomyId: number): Promise<TaxonomyTermsResponse> {
		return await api.get(`${TAXONOMIES_PREFIX_URL}/${taxonomyId}/terms`).json();
	}

	public async getTerm(taxonomyId: number, termId: number): Promise<TaxonomyTerm> {
		return await api.get(`${TAXONOMIES_PREFIX_URL}/${taxonomyId}/terms/${termId}`).json();
	}

	public async createTerm(
		taxonomyId: number,
		taxonomyTerm: CreateTaxonomyTermPayload
	): Promise<TaxonomyTerm> {
		return await api
			.post(`${TAXONOMIES_PREFIX_URL}/${taxonomyId}/terms`, { json: taxonomyTerm })
			.json();
	}

	public async updateTerm(
		taxonomyId: number,
		taxonomyTerm: UpdateTaxonomyTermPayload
	): Promise<TaxonomyTerm> {
		return await api
			.put(`${TAXONOMIES_PREFIX_URL}/${taxonomyId}/terms/${taxonomyTerm.id}`, {
				json: taxonomyTerm,
			})
			.json();
	}

	public async updateTerms(
		taxonomyId: number,
		taxonomyTerms: UpdateTaxonomyTermPayload[]
	): Promise<TaxonomyTermsResponse> {
		return await api
			.put(`${TAXONOMIES_PREFIX_URL}/${taxonomyId}/terms`, {
				json: taxonomyTerms,
			})
			.json();
	}
}

export const taxonomyTermsApiService = new TaxonomyTermsApiService();
