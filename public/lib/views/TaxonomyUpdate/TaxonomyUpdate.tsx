import {
	Container,
	ContextHeader,
	ContextHeaderTopSection,
} from '@acpaas-ui/react-editorial-components';
import { ModuleRouteConfig, useBreadcrumbs } from '@redactie/redactie-core';
import { DataLoader, RenderChildRoutes, useNavigate, useTenantContext } from '@redactie/utils';
import React, { FC, ReactElement, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { useActiveTabs, useActiveTaxonomy, useTaxonomiesUIStates } from '../../hooks';
import { BREADCRUMB_OPTIONS, DETAIL_TABS, MODULE_PATHS } from '../../taxonomy.const';
import { TaxonomyRouteProps } from '../../taxonomy.types';

const CustomCCUpdate: FC<TaxonomyRouteProps> = ({ location, route, match }) => {
	const { taxonomyId } = match.params;

	/**
	 * Hooks
	 */

	const { tenantId } = useTenantContext();
	const { generatePath, navigate } = useNavigate();

	const [initialLoading, setInitialLoading] = useState(true);
	const guardsMeta = useMemo(() => ({ tenantId }), [tenantId]);

	const activeTabs = useActiveTabs(DETAIL_TABS, location.pathname);
	const breadcrumbs = useBreadcrumbs(route.routes as ModuleRouteConfig[], {
		...BREADCRUMB_OPTIONS(generatePath),
		extraBreadcrumbs: [
			...(BREADCRUMB_OPTIONS(generatePath).extraBreadcrumbs || []),
			{ name: 'Taxonomie', target: generatePath(MODULE_PATHS.overview) },
		],
	});
	const [activeTaxonomy] = useActiveTaxonomy(taxonomyId);
	const [, detailState] = useTaxonomiesUIStates(taxonomyId);

	// Set initial loading
	useEffect(() => {
		if (initialLoading && detailState && !detailState.isFetching && activeTaxonomy) {
			return setInitialLoading(false);
		}
	}, [initialLoading, detailState, activeTaxonomy]);

	/**
	 * Methods
	 */

	const onCancel = (): void => {
		navigate(MODULE_PATHS.overview);
	};

	const pageTitle = activeTaxonomy ? `${activeTaxonomy?.id} bewerken` : 'Taxonomie bewerken';

	/**
	 * Render
	 */

	const renderChildRoutes = (): ReactElement | null => {
		const extraOptions = {
			taxonomy: activeTaxonomy,
			onCancel,
		};

		return (
			<RenderChildRoutes
				routes={route.routes}
				guardsMeta={guardsMeta}
				extraOptions={extraOptions}
			/>
		);
	};

	return (
		<>
			<ContextHeader
				linkProps={(props: { href: string }) => ({
					...props,
					to: generatePath(`${MODULE_PATHS.detail}/${props.href}`, {
						taxonomyId,
					}),
					component: Link,
				})}
				tabs={activeTabs}
				title={pageTitle}
			>
				<ContextHeaderTopSection>{breadcrumbs}</ContextHeaderTopSection>
			</ContextHeader>
			<Container>
				<DataLoader loadingState={initialLoading} render={renderChildRoutes} />
			</Container>
		</>
	);
};

export default CustomCCUpdate;
