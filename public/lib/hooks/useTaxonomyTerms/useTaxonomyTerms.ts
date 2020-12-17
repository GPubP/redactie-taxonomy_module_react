import { useObservable } from '@redactie/utils';

import { TaxonomyTerm } from '../../services/taxonomyTerms';
import { taxonomyTermsFacade } from '../../store/taxonomyTerms';

export const useTaxonomyTerms = (): TaxonomyTerm[] => {
	const taxonomyTerms = useObservable(taxonomyTermsFacade.taxonomyTerms$, []);

	return taxonomyTerms;
};
