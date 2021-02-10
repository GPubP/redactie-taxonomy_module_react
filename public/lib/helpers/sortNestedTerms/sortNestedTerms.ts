import { NestedTaxonomyTerm } from '../../taxonomy.types';

export const sortNestedTerms = (termsTree: NestedTaxonomyTerm[]): NestedTaxonomyTerm[] => {
	const sorted = termsTree.sort((a, b) => (a.position || 0) - (b.position || 0));
	sorted.forEach(term => {
		if (term.children?.length) {
			term.children = sortNestedTerms(term.children);
		}
	});
	return sorted;
};
