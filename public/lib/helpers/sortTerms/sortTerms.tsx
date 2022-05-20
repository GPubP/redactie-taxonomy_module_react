import { SortableTerm } from './sortTerms.types';

export const sortTerms = <T extends Omit<SortableTerm<T>, 'children'>>(terms: T[]): T[] => {
	return terms.sort((a, b) => (a.position || 0) - (b.position || 0));
};
