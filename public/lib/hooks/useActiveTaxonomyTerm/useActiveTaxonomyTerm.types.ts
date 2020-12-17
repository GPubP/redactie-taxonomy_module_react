import { TaxonomyTermDetailModel, TaxonomyTermDetailUIModel } from '../../store/taxonomyTerms';

export type UseActiveTaxonomyTerm = (
	taxonomyId?: number | null,
	termId?: number | null
) => [TaxonomyTermDetailModel | undefined, TaxonomyTermDetailUIModel | undefined];
