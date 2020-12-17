import { useObservable } from '@redactie/utils';
import { useEffect } from 'react';

import { taxonomyTermsFacade } from '../../store/taxonomyTerms';

import { UseActiveTaxonomyTerm } from './useActiveTaxonomyTerm.types';

const useActiveTaxonomyTerm: UseActiveTaxonomyTerm = (taxonomyId, termId) => {
	useEffect(() => {
		if (!termId) {
			// remove active Taxonomy when taxonomyId is undefined
			taxonomyTermsFacade.removeActiveTaxonomyTerm();
			return;
		}

		const hasTaxonomy = taxonomyTermsFacade.hasTaxonomyTerm(termId);

		if (hasTaxonomy && taxonomyTermsFacade.hasActiveTaxonomyTerm(termId)) {
			return;
		}

		if (!hasTaxonomy && taxonomyId) {
			taxonomyTermsFacade
				.getTaxonomyTerm(taxonomyId, termId)
				.then(() => taxonomyTermsFacade.setActiveTaxonomyTerm(termId));
			return;
		}

		taxonomyTermsFacade.setActiveTaxonomyTerm(termId);
	}, [taxonomyId, termId]);

	const taxonomy = useObservable(taxonomyTermsFacade.activeTaxonomyTerm$);
	const taxonomyUI = useObservable(taxonomyTermsFacade.activeTaxonomyTermUI$);

	return [taxonomy, taxonomyUI];
};

export default useActiveTaxonomyTerm;
