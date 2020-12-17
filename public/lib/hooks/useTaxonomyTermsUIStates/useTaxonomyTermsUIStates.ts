import { useObservable } from '@redactie/utils';
import { useMemo } from 'react';

import { taxonomyTermsFacade } from '../../store/taxonomyTerms';

import { UseTaxonomyTermsUIStates } from './useTaxonomyTermsUIStates.types';

const useTaxonomyTermsUIStates: UseTaxonomyTermsUIStates = (termId = 0) => {
	const taxonomyTermDetailUIStateObservable = useMemo(
		() => taxonomyTermsFacade.selectTaxonomyTermUIState(termId),
		[termId]
	);
	const taxonomyUIStateObservable = useMemo(() => taxonomyTermsFacade.selectUIState(), []);
	const taxonomyTermUIState = useObservable(taxonomyUIStateObservable, {
		isFetching: false,
		isCreating: false,
		error: null,
	});
	const taxonomyTermDetailUIState = useObservable(taxonomyTermDetailUIStateObservable);

	return [taxonomyTermUIState, taxonomyTermDetailUIState];
};

export default useTaxonomyTermsUIStates;
