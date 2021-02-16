import { TaxonomyTermDetailModel, TaxonomyTermDetailUIModel } from '../../store/taxonomies';

export type UseTaxonomyTerm = (
	taxonomyId?: number | null,
	termId?: number | null
) => [TaxonomyTermDetailModel | undefined, TaxonomyTermDetailUIModel | undefined];
