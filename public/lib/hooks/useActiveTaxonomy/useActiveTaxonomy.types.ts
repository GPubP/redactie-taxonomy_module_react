import { TaxonomyDetailModel, TaxonomyDetailUIModel } from '../../store/taxonomies';

export type UseActiveTaxonomy = (
	taxonomyId?: number
) => [TaxonomyDetailModel | undefined, TaxonomyDetailUIModel | undefined];
