import { useObservable } from '@redactie/utils';
import { useEffect } from 'react';

import { taxonomiesFacade } from '../../store/taxonomies';

import { UseActiveTaxonomyTerm } from './useActiveTaxonomyTerm.types';

const useActiveTaxonomyTerm: UseActiveTaxonomyTerm = (taxonomyId, termId) => {
	useEffect(() => {
		if (!termId) {
			// remove active Taxonomy when taxonomyId is undefined
			taxonomiesFacade.removeActiveTaxonomyTerm();
			return;
		}

		const hasTaxonomy = taxonomiesFacade.hasTaxonomyTerm(termId);

		if (hasTaxonomy && taxonomiesFacade.hasActiveTaxonomyTerm(termId)) {
			return;
		}

		if (!hasTaxonomy && taxonomyId) {
			taxonomiesFacade
				.getTaxonomyTerm(taxonomyId, termId)
				.then(() => taxonomiesFacade.setActiveTaxonomyTerm(termId));
			return;
		}

		taxonomiesFacade.setActiveTaxonomyTerm(termId);
	}, [taxonomyId, termId]);

	const taxonomy = useObservable(taxonomiesFacade.activeTaxonomyTerm$);
	const taxonomyUI = useObservable(taxonomiesFacade.activeTaxonomyTermUI$);

	return [taxonomy, taxonomyUI];
};

export default useActiveTaxonomyTerm;
