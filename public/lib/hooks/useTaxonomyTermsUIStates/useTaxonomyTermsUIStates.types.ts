import { TaxonomyTermDetailUIModel, TaxonomyTermUIModel } from '../../store/taxonomyTerms';

export type UseTaxonomyTermsUIStates = (
	taxonomyId?: number,
	termId?: number
) => [TaxonomyTermUIModel, TaxonomyTermDetailUIModel | undefined];
