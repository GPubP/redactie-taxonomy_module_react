export const listToTree = <T>(
	data: T[],
	options: {
		idKey?: number | string;
		parentKey?: string;
		childrenKey?: string;
		skipTrees: (number | string)[];
	}
): (T & { children?: T[] })[] => {
	options = options || {};
	const ID_KEY = options.idKey || 'id';
	const PARENT_KEY = options.parentKey || 'parent';
	const CHILDREN_KEY = options.childrenKey || 'children';

	const tree: T[] = [];
	const childrenOf: any = {};

	let item: any;
	let id: number;
	let parentId: number;

	for (let i = 0, length = data.length; i < length; i++) {
		item = { ...data[i] };
		id = item[ID_KEY];
		parentId = item[PARENT_KEY] && item[PARENT_KEY] !== id ? item[PARENT_KEY] : 0;
		// every item may have children
		childrenOf[id] = childrenOf[id] || [];
		// init its children
		item[CHILDREN_KEY] = childrenOf[id];

		if (parentId != 0) {
			// init its parent's children object
			childrenOf[parentId] = childrenOf[parentId] || [];
			// push it into its parent's children object
			childrenOf[parentId].push(item);
		} else {
			tree.push(item);
		}
	}

	return tree;
};
