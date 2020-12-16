import { TaxonomyDetailModel, TaxonomyDetailUIModel } from '../../store/taxonomies';

export type UseActiveTaxonomy = (
	taxonomyId?: string
) => [TaxonomyDetailModel | undefined, TaxonomyDetailUIModel | undefined];
