import { parseSearchParams, SearchParams } from '@redactie/utils';

import { api } from '../api';

import {
	DEFAULT_TAXONOMIES_SEARCH_PARAMS,
	TAXONOMIES_PREFIX_URL,
} from './taxonomies.service.const';
import {
	CreateTaxonomyPayload,
	TaxonomiesResponse,
	TaxonomyDetailResponse,
	UpdateTaxonomySettingsPayload,
} from './taxonomies.service.types';

export class TaxonomiesApiService {
	public async getTaxonomies(
		searchParams: SearchParams = DEFAULT_TAXONOMIES_SEARCH_PARAMS
	): Promise<TaxonomiesResponse> {
		return await api
			.get(TAXONOMIES_PREFIX_URL, { searchParams: parseSearchParams(searchParams) })
			.json();
	}

	public async getTaxonomy(taxonomyId: number): Promise<TaxonomyDetailResponse> {
		return await api.get(`${TAXONOMIES_PREFIX_URL}/${taxonomyId}`).json();
	}

	public async createTaxonomy(taxonomy: CreateTaxonomyPayload): Promise<TaxonomyDetailResponse> {
		return await api.post(`${TAXONOMIES_PREFIX_URL}/`, { json: taxonomy }).json();
	}

	public async updateTaxonomySettings(
		taxonomy: UpdateTaxonomySettingsPayload
	): Promise<TaxonomyDetailResponse> {
		return await api
			.put(`${TAXONOMIES_PREFIX_URL}/${taxonomy.id}/settings`, { json: taxonomy.body })
			.json();
	}

	public async deleteTaxonomy(taxonomyId: number): Promise<void> {
		return await api.delete(`${TAXONOMIES_PREFIX_URL}/${taxonomyId}`).json();
	}
}

export const taxonomiesApiService = new TaxonomiesApiService();
