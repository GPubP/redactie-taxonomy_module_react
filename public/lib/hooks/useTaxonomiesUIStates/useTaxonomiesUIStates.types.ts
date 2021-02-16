import { TaxonomyDetailUIModel, TaxonomyListUIModel } from '../../store/taxonomies';

export type UseTaxonomiesUIStates = (
	taxonomyId?: number
) => [TaxonomyListUIModel, TaxonomyDetailUIModel | undefined];
