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
import { UpdateTaxonomySettingsPayload } from '../../services/taxonomies';
import { taxonomiesFacade } from '../../store/taxonomies';
import {
	ALERT_CONTAINER_IDS,
	BREADCRUMB_OPTIONS,
	DETAIL_TAB_MAP,
	DETAIL_TABS,
	MODULE_PATHS,
} from '../../taxonomy.const';
import { Tab, TaxonomyRouteProps } from '../../taxonomy.types';

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
	const [activeTaxonomy] = useActiveTaxonomy(Number(taxonomyId));
	const [, detailState] = useTaxonomiesUIStates(Number(taxonomyId));

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

	const updateTaxonomy = (body: UpdateTaxonomySettingsPayload['body'], tab: Tab): void => {
		switch (tab.name) {
			case DETAIL_TAB_MAP.settings.name: {
				const payload = { id: Number(taxonomyId), body };
				const options = { alertContainerId: ALERT_CONTAINER_IDS.detailSettings };

				taxonomiesFacade.updateTaxonomy(payload, options);
				break;
			}
			default:
				break;
		}
	};

	const pageTitle = activeTaxonomy ? `${activeTaxonomy?.label} bewerken` : 'Taxonomie bewerken';

	/**
	 * Render
	 */

	const renderChildRoutes = (): ReactElement | null => {
		const extraOptions = {
			taxonomy: activeTaxonomy,
			onCancel,
			onSubmit: updateTaxonomy,
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
