import { PaginatorPlugin } from '@datorama/akita';

import { taxonomyTermListQuery } from './taxonomyTerms-list.query';

export const taxonomyTermsListPaginator = new PaginatorPlugin(taxonomyTermListQuery)
	.withControls()
	.withRange();
