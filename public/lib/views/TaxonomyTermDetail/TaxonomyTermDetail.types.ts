import { TaxonomyRouteParams, TaxonomyRouteProps } from '../../taxonomy.types';

export interface TaxonomyTermRouteParams extends TaxonomyRouteParams {
	termId?: string;
}

export type TaxonomyTermRouteProps = TaxonomyRouteProps<TaxonomyTermRouteParams>;
