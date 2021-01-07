import { TaxonomyTermDetailUIModel } from '../../store/taxonomies';

export type UseTaxonomyTermsUIStates = (
	taxonomyId?: number,
	termId?: number
) => [{ isCreating: boolean }, TaxonomyTermDetailUIModel | undefined];
