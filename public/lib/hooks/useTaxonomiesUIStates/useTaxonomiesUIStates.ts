import { useObservable } from '@redactie/utils';
import { useMemo } from 'react';

import { taxonomiesFacade } from '../../store/taxonomies';

import { UseTaxonomiesUIStates } from './useTaxonomiesUIStates.types';

const useTaxonomiesUIStates: UseTaxonomiesUIStates = (taxonomyId = '') => {
	const taxonomyDetailUIStateObservable = useMemo(
		() => taxonomiesFacade.selectTaxonomyUIState(taxonomyId),
		[taxonomyId]
	);
	const taxonomyUIStateObservable = useMemo(() => taxonomiesFacade.selectUIState(), []);
	const taxonomyUIState = useObservable(taxonomyUIStateObservable, {
		isFetching: false,
		isCreating: false,
		error: null,
	});
	const taxonomyDetailUIState = useObservable(taxonomyDetailUIStateObservable);

	return [taxonomyUIState, taxonomyDetailUIState];
};

export default useTaxonomiesUIStates;
