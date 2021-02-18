import { TaxonomyDetailModel, TaxonomyDetailUIModel } from '../../store/taxonomies';

export type UseTaxonomy = (
	taxonomyId?: number
) => [TaxonomyDetailModel | undefined, TaxonomyDetailUIModel | undefined];
