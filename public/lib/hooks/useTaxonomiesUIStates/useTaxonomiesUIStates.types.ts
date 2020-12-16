import { TaxonomyDetailUIModel, TaxonomyUIModel } from '../../store/taxonomies';

export type UseTaxonomiesUIStates = (
	taxonomyId?: string
) => [TaxonomyUIModel, TaxonomyDetailUIModel | undefined];
