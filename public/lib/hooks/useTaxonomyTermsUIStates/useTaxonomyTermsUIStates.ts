import { useObservable } from '@redactie/utils';
import { useMemo } from 'react';

import { taxonomiesFacade } from '../../store/taxonomies';

import { UseTaxonomyTermsUIStates } from './useTaxonomyTermsUIStates.types';

const useTaxonomyTermsUIStates: UseTaxonomyTermsUIStates = (termId = 0) => {
	const taxonomyTermDetailUIStateObservable = useMemo(
		() => taxonomiesFacade.selectTaxonomyTermUIState(termId),
		[termId]
	);
	const taxonomyTermDetailUIState = useObservable(taxonomyTermDetailUIStateObservable);

	return [taxonomyTermDetailUIState];
};

export default useTaxonomyTermsUIStates;
