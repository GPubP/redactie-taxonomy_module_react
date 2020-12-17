import { CacheEntityState } from '@redactie/utils';

import { TaxonomyTerm } from '../../../services/taxonomyTerms';

export type TaxonomyTermListModel = TaxonomyTerm;

export type TaxonomyTermsListState = CacheEntityState<TaxonomyTermListModel, number>;
