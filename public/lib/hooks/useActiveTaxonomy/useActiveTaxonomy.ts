import { useObservable } from '@redactie/utils';
import { useEffect } from 'react';

import { taxonomiesFacade } from '../../store/taxonomies';

import { UseActiveTaxonomy } from './useActiveTaxonomy.types';

const useActiveTaxonomy: UseActiveTaxonomy = (taxonomyId?: string) => {
	useEffect(() => {
		if (taxonomyId) {
			const hasTaxonomy = taxonomiesFacade.hasTaxonomy(taxonomyId);
			if (hasTaxonomy && taxonomiesFacade.hasActiveTaxonomy(taxonomyId)) {
				return;
			}

			if (!hasTaxonomy) {
				taxonomiesFacade
					.getTaxonomy(taxonomyId)
					.then(() => taxonomiesFacade.setActiveTaxonomy(taxonomyId));
				return;
			}

			taxonomiesFacade.setActiveTaxonomy(taxonomyId);
			return;
		}
		// remove active Taxonomy when taxonomyId is undefined
		taxonomiesFacade.removeActiveTaxonomy();
	}, [taxonomyId]);

	const taxonomy = useObservable(taxonomiesFacade.activeTaxonomy$);
	const taxonomyUI = useObservable(taxonomiesFacade.activeTaxonomyUI$);

	return [taxonomy, taxonomyUI];
};

export default useActiveTaxonomy;
