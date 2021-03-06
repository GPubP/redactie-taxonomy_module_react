import { CacheEntityState, CacheEntityUI, CacheEntityUIState } from '@redactie/utils';

import { TaxonomyDetailResponse } from '../../../services/taxonomies';

export type TaxonomyDetailModel = TaxonomyDetailResponse;
export type TaxonomyDetailUIModel = CacheEntityUI;

export type TaxonomiesDetailState = CacheEntityState<TaxonomyDetailModel, number>;

export type TaxonomiesDetailUIState = CacheEntityUIState<TaxonomyDetailUIModel>;
