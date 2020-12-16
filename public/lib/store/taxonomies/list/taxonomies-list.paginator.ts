import { PaginatorPlugin } from '@datorama/akita';

import { taxonomiesListQuery } from './taxonomies-list.query';

export const taxonomiesListPaginator = new PaginatorPlugin(taxonomiesListQuery)
	.withControls()
	.withRange();
