import { Button } from '@acpaas-ui/react-components';
import {
	Container,
	ContextHeader,
	ContextHeaderActionsSection,
	ContextHeaderTopSection,
} from '@acpaas-ui/react-editorial-components';
import { ModuleRouteConfig, useBreadcrumbs } from '@redactie/redactie-core';
import {
	ContextHeaderTab,
	DataLoader,
	RenderChildRoutes,
	useNavigate,
	useRoutes,
	useTenantContext,
} from '@redactie/utils';
import React, { FC, ReactElement, useEffect, useMemo, useState } from 'react';
import { Link, matchPath } from 'react-router-dom';

import { CORE_TRANSLATIONS, useCoreTranslation } from '../../connectors';
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
import { TaxonomyRouteProps } from '../../taxonomy.types';

import { DEFAULT_HEADER_BADGES } from './TaxonomyUpdate.const';

const CustomCCUpdate: FC<TaxonomyRouteProps> = ({ location, route, match }) => {
	const taxonomyId = parseInt(match.params.taxonomyId);

	/**
	 * Hooks
	 */

	const { tenantId } = useTenantContext();
	const { generatePath, navigate } = useNavigate();

	const [initialLoading, setInitialLoading] = useState(true);
	const guardsMeta = useMemo(() => ({ tenantId }), [tenantId]);
	const isTermsOverview = useMemo(
		() =>
			!!matchPath(location.pathname, {
				path: `/:tenantId${MODULE_PATHS.detailTerms}`,
				exact: true,
			}),
		[location.pathname]
	);

	const activeTabs = useActiveTabs(DETAIL_TABS, location.pathname);
	const routes = useRoutes();
	const breadcrumbs = useBreadcrumbs(routes as ModuleRouteConfig[], {
		...BREADCRUMB_OPTIONS(generatePath),
		extraBreadcrumbs: [
			...(BREADCRUMB_OPTIONS(generatePath).extraBreadcrumbs || []),
			{ name: 'Taxonomie', target: generatePath(MODULE_PATHS.overview) },
		],
	});
	const [t] = useCoreTranslation();
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

	const updateTaxonomy = (
		body: UpdateTaxonomySettingsPayload['body'],
		tab: ContextHeaderTab
	): void => {
		switch (tab.name) {
			case DETAIL_TAB_MAP.settings.name: {
				const payload = { id: taxonomyId, body };
				const options = { alertContainerId: ALERT_CONTAINER_IDS.detailSettings };

				taxonomiesFacade.updateTaxonomy(payload, options);
				break;
			}
			default:
				break;
		}
	};

	const pageTitle = (
		<>
			<i>{activeTaxonomy?.label ?? 'Taxonomie'}</i> {t(CORE_TRANSLATIONS.ROUTING_UPDATE)}
		</>
	);

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
				badges={DEFAULT_HEADER_BADGES}
			>
				<ContextHeaderTopSection>{breadcrumbs}</ContextHeaderTopSection>
				{isTermsOverview && (
					<ContextHeaderActionsSection>
						<Button
							iconLeft="plus"
							onClick={() => navigate(MODULE_PATHS.terms.create, { taxonomyId })}
						>
							{t(CORE_TRANSLATIONS['BUTTON_CREATE-NEW'])}
						</Button>
					</ContextHeaderActionsSection>
				)}
			</ContextHeader>
			<Container>
				<DataLoader loadingState={initialLoading} render={renderChildRoutes} />
			</Container>
		</>
	);
};

export default CustomCCUpdate;
