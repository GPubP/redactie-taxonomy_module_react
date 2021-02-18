import { useEffect, useState } from 'react';

import {
	taxonomiesFacade,
	TaxonomyDetailModel,
	TaxonomyDetailUIModel,
} from '../../store/taxonomies';

import { UseTaxonomy } from './useTaxonomy.types';

const useTaxonomy: UseTaxonomy = taxonomyId => {
	const [taxonomy, setTaxonomy] = useState<TaxonomyDetailModel>();
	const [taxonomyUI, setTaxonomyUI] = useState<TaxonomyDetailUIModel>();

	useEffect(() => {
		if (!taxonomyId) {
			return;
		}

		const hasTaxonomy = taxonomiesFacade.hasTaxonomy(taxonomyId);

		if (!hasTaxonomy) {
			taxonomiesFacade.getTaxonomy(taxonomyId);
		}

		const presetSubscription = taxonomiesFacade
			.selectTaxonomy(taxonomyId)
			.subscribe(setTaxonomy);
		const presetUISubscription = taxonomiesFacade
			.selectTaxonomyUIState(taxonomyId)
			.subscribe(setTaxonomyUI);

		return () => {
			presetSubscription.unsubscribe();
			presetUISubscription.unsubscribe();
		};
	}, [taxonomyId]);

	return [taxonomy, taxonomyUI];
};

export default useTaxonomy;
