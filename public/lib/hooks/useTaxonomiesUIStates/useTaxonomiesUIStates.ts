import { useObservable } from '@redactie/utils';

import { taxonomiesFacade } from '../../store/taxonomies';

import { UseTaxonomiesUIStates } from './useTaxonomiesUIStates.types';

const useTaxonomiesUIStates: UseTaxonomiesUIStates = (taxonomyId = '') => {
	const taxonomyUIState = useObservable(taxonomiesFacade.selectUIState(), {
		isFetching: false,
		isCreating: false,
		error: null,
	});
	const taxonomyDetailUIState = useObservable(taxonomiesFacade.selectTaxonomyUIState(taxonomyId));

	return [taxonomyUIState, taxonomyDetailUIState];
};

export default useTaxonomiesUIStates;
