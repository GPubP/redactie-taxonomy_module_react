import { SortableTerm } from './sortTerms.types';

export const sortNestedTerms = <T extends SortableTerm<T>>(termsTree: T[]): T[] => {
	const sorted = termsTree.sort((a, b) => (a.position || 0) - (b.position || 0));

	sorted.forEach(term => {
		if (term.children?.length) {
			term.children = sortNestedTerms(term.children);
		}
	});

	return sorted;
};
