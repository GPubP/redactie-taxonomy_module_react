import { TaxonomyTermDetailUIModel } from '../../store/taxonomies';

export type UseTaxonomyTermsUIStates = (
	taxonomyId?: number,
	termId?: number
) => [TaxonomyTermDetailUIModel | undefined];
