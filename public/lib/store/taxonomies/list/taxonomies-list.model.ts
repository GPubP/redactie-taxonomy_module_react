import { CacheEntityState } from '@redactie/utils';

import { Taxonomy } from '../../../services/taxonomies';

export type TaxonomyListModel = Taxonomy;

export type TaxonomiesListState = CacheEntityState<TaxonomyListModel, string>;
