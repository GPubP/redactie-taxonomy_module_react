import { CacheEntityState, CacheEntityUI, CacheEntityUIState } from '@redactie/utils';

import { TaxonomyTerm } from '../../../services/taxonomyTerms';

export type TaxonomyTermDetailModel = TaxonomyTerm;
export type TaxonomyTermDetailUIModel = CacheEntityUI;

export type TaxonomyTermsDetailState = CacheEntityState<TaxonomyTermDetailModel, number>;

export type TaxonomyTermsDetailUIState = CacheEntityUIState<TaxonomyTermDetailUIModel>;
