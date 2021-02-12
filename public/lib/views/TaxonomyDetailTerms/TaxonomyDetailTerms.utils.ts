import { TaxonomyTerm } from '../../services/taxonomyTerms';
import { NestedTaxonomyTerm } from '../../taxonomy.types';

/**
 * Tree
 */

export const termIsTopLevel = (term: NestedTaxonomyTerm): boolean =>
	!term.parentTermId || term.parentTermId === term.id;

export const findNestedTerm = (
	treeArray: NestedTaxonomyTerm[] | undefined,
	termId: number
): NestedTaxonomyTerm | undefined => {
	if (!treeArray?.length) {
		return;
	}

	return (
		treeArray.find(tree => tree.id === termId) ||
		findNestedTerm(
			treeArray.flatMap(tree => tree.children || []),
			termId
		)
	);
};

export const recursiveFlatten = (tree: NestedTaxonomyTerm[]): TaxonomyTerm[] => {
	const nestedLevels = tree.map(nested => recursiveFlatten(nested.children || [])).flat();

	return tree.concat(nestedLevels);
};

/**
 * Arrow/single movement
 */

export const canMoveLeft = (term: TaxonomyTerm): boolean => {
	return !termIsTopLevel(term);
};

export const canMoveUp = (termsTree: NestedTaxonomyTerm[], term: TaxonomyTerm): boolean => {
	if (termIsTopLevel(term)) {
		const termIndex = termsTree.findIndex(tree => tree.id === term.id);

		return termIndex > 0;
	}

	const parent = findNestedTerm(termsTree, term.parentTermId);

	if (parent?.children?.length) {
		const termIndex = parent.children.findIndex(child => child.id === term.id);

		return termIndex > 0;
	}
	return false;
};

export const canMoveDown = (termsTree: NestedTaxonomyTerm[], term: TaxonomyTerm): boolean => {
	if (termIsTopLevel(term)) {
		const termIndex = termsTree.findIndex(tree => tree.id === term.id);

		return termIndex < termsTree.length - 1;
	}

	const parent = findNestedTerm(termsTree, term.parentTermId);

	if (parent?.children?.length) {
		const termIndex = parent.children.findIndex(child => child.id === term.id);

		return termIndex < parent.children.length - 1;
	}
	return false;
};

export const canMoveRight = (termsTree: NestedTaxonomyTerm[], term: TaxonomyTerm): boolean => {
	if (termIsTopLevel(term)) {
		const termIndex = termsTree.findIndex(tree => tree.id === term.id);

		return termIndex > 0;
	}

	const parent = findNestedTerm(termsTree, term.parentTermId);

	if (!parent?.children) {
		return false;
	}

	const termIndex = parent.children.findIndex(child => child.id === term.id);

	return termIndex < 1
		? false
		: parent.children.length > 1 ||
				parent.children.some(child => child.children?.length || 0 > 1);
};
