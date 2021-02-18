import { useEffect, useState } from 'react';

import {
	taxonomiesFacade,
	TaxonomyTermDetailModel,
	TaxonomyTermDetailUIModel,
} from '../../store/taxonomies';

import { UseTaxonomyTerm } from './useTaxonomyTerm.types';

const useTaxonomyTerm: UseTaxonomyTerm = (taxonomyId, termId) => {
	const [term, setTerm] = useState<TaxonomyTermDetailModel>();
	const [termUI, setTermUI] = useState<TaxonomyTermDetailUIModel>();

	useEffect(() => {
		if (!termId) {
			return;
		}

		const hasTerm = taxonomiesFacade.hasTaxonomyTerm(termId);

		if (!hasTerm && taxonomyId) {
			taxonomiesFacade.getTaxonomyTerm(taxonomyId, termId);
		}

		const termSubscription = taxonomiesFacade.selectTaxonomyTerm(termId).subscribe(setTerm);
		const termUISubscription = taxonomiesFacade
			.selectTaxonomyTermUIState(termId)
			.subscribe(setTermUI);

		return () => {
			termSubscription.unsubscribe();
			termUISubscription.unsubscribe();
		};
	}, [taxonomyId, termId]);

	return [term, termUI];
};

export default useTaxonomyTerm;
