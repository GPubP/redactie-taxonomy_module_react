export const listToTree = <T>(
	data: T[],
	options: {
		idKey?: number | string;
		parentKey?: string;
		childrenKey?: string;
		addPosition?: boolean;
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
	let parentIndex = 0;
	let childIndex = 0;

	for (let i = 0, length = data.length; i < length; i++) {
		item = { ...data[i] };

		id = item[ID_KEY];
		parentId = item[PARENT_KEY] && item[PARENT_KEY] !== id ? item[PARENT_KEY] : 0;
		// every item may have children
		childrenOf[id] = childrenOf[id] || [];
		// init its children
		item[CHILDREN_KEY] = childrenOf[id];

		const positionPropertyValue = item.propertyValues?.find(
			(propertyValue: { id: number; value: string; key: string }) => propertyValue.value
		);

		if (parentId != 0) {
			if (options.addPosition) {
				item.position = positionPropertyValue?.value
					? Number(positionPropertyValue.value)
					: childIndex;
				childIndex += 1;
			}
			// init its parent's children object
			childrenOf[parentId] = childrenOf[parentId] || [];
			// push it into its parent's children object
			childrenOf[parentId].push(item);
		} else {
			if (options.addPosition) {
				item.position = positionPropertyValue?.value
					? Number(positionPropertyValue.value)
					: parentIndex;
				childIndex = 0;
				parentIndex += 1;
			}
			tree.push(item);
		}
	}

	return tree;
};
