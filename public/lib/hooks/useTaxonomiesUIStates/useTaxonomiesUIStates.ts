import { useObservable } from '@redactie/utils';
import { useEffect, useState } from 'react';

import { taxonomiesFacade, TaxonomyDetailUIModel } from '../../store/taxonomies';

import { UseTaxonomiesUIStates } from './useTaxonomiesUIStates.types';

const useTaxonomiesUIStates: UseTaxonomiesUIStates = taxonomyId => {
	const taxonomyUIState = useObservable(taxonomiesFacade.UIState$, {
		isFetching: false,
		isCreating: false,
		error: null,
	});
	const [taxonomyDetailUIState, setPresetDetailUIState] = useState<TaxonomyDetailUIModel>();

	useEffect(() => {
		const s = taxonomiesFacade
			.selectTaxonomyUIState(taxonomyId)
			.subscribe(setPresetDetailUIState);

		return () => {
			s.unsubscribe();
		};
	}, [taxonomyId]);

	return [taxonomyUIState, taxonomyDetailUIState];
};

export default useTaxonomiesUIStates;
