import { TaxonomyTermDetailUIModel } from '../../store/taxonomies';

export type UseTaxonomyTermsUIStates = (
	termId?: number
) => [{ isCreating: boolean }, TaxonomyTermDetailUIModel | undefined];
