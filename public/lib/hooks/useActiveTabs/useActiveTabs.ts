import { useMemo } from 'react';

import { Tab } from '../../customCC.types';

const useActiveTabs = (tabs: Tab[], pathname: string): Tab[] => {
	const activeTabs = useMemo(() => {
		return tabs.map(tab => ({
			...tab,
			active: new RegExp(`/${tab.target}/?$`).test(pathname),
		}));
	}, [pathname, tabs]);

	return activeTabs;
};

export default useActiveTabs;
