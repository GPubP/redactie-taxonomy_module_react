import { TaxonomyDetailUIModel, TaxonomyUIModel } from '../../store/taxonomies';

export type UseTaxonomiesUIStates = (
	taxonomyId?: number
) => [TaxonomyUIModel, TaxonomyDetailUIModel | undefined];
