import { PaginationResponse } from '@datorama/akita';
import { SearchParams } from '@redactie/utils';

import { TaxonomyListModel } from '../../store/taxonomies';

export type UsePaginatedTaxonomies = (
	sitesSearchParams: SearchParams,
	clearCache?: boolean
) => {
	loading: boolean;
	pagination: PaginationResponse<TaxonomyListModel> | null;
	refreshCurrentPage: () => void;
	error: any | null;
};
