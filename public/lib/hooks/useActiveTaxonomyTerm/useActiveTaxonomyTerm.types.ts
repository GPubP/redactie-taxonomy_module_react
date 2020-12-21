import { TaxonomyTermDetailModel, TaxonomyTermDetailUIModel } from '../../store/taxonomies';

export type UseActiveTaxonomyTerm = (
	taxonomyId?: number | null,
	termId?: number | null
) => [TaxonomyTermDetailModel | undefined, TaxonomyTermDetailUIModel | undefined];
