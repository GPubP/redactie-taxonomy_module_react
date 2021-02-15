import {
	Container,
	ContextHeader,
	ContextHeaderTopSection,
} from '@acpaas-ui/react-editorial-components';
import { ModuleRouteConfig, useBreadcrumbs } from '@redactie/redactie-core';
import {
	AlertContainer,
	DataLoader,
	RenderChildRoutes,
	useNavigate,
	useRoutes,
	useTenantContext,
} from '@redactie/utils';
import React, { FC, ReactElement, useMemo } from 'react';
import { Link } from 'react-router-dom';

import { CORE_TRANSLATIONS, useCoreTranslation } from '../../connectors';
import { useActiveTabs } from '../../hooks';
import { CreateTaxonomyPayload } from '../../services/taxonomies';
import { taxonomiesFacade } from '../../store/taxonomies';
import {
	ALERT_CONTAINER_IDS,
	BREADCRUMB_OPTIONS,
	DETAIL_TABS,
	MODULE_PATHS,
} from '../../taxonomy.const';
import { TaxonomyRouteProps } from '../../taxonomy.types';

import { TAXONOMY_CREATE_ALLOWED_PATHS } from './TaxonomyCreate.const';

const TaxonomyCreate: FC<TaxonomyRouteProps> = ({ location, route }) => {
	/**
	 * Hooks
	 */

	const { tenantId } = useTenantContext();

	const guardsMeta = useMemo(() => ({ tenantId }), [tenantId]);
	const [t] = useCoreTranslation();
	const activeTabs = useActiveTabs(DETAIL_TABS.slice(0, 1), location.pathname);
	const { generatePath, navigate } = useNavigate();
	const routes = useRoutes();
	const breadcrumbs = useBreadcrumbs(routes as ModuleRouteConfig[], {
		...BREADCRUMB_OPTIONS(generatePath),
		extraBreadcrumbs: [
			...(BREADCRUMB_OPTIONS(generatePath).extraBreadcrumbs || []),
			{ name: 'Taxonomie', target: generatePath(MODULE_PATHS.overview) },
		],
	});

	/**
	 * Methods
	 */

	const generateEmptyTaxonomy = (): CreateTaxonomyPayload => ({
		description: '',
		label: '',
		publishStatus: '',
	});

	const createTaxonomy = (payload: CreateTaxonomyPayload): void => {
		taxonomiesFacade
			.createTaxonomy(payload, {
				errorAlertContainerId: ALERT_CONTAINER_IDS.create,
				successAlertContainerId: ALERT_CONTAINER_IDS.detailTerms,
			})
			.then(response => {
				if (response && response.id) {
					navigate(MODULE_PATHS.detailTerms, { taxonomyId: response.id });
				}
			});
	};

	/**
	 * Render
	 */
	const pageTitle = `Taxonomie ${t(CORE_TRANSLATIONS.ROUTING_CREATE)}`;

	const renderChildRoutes = (): ReactElement | null => {
		const extraOptions = {
			allowedPaths: TAXONOMY_CREATE_ALLOWED_PATHS,
			taxonomy: generateEmptyTaxonomy(),
			onCancel: () => navigate(MODULE_PATHS.overview),
			onSubmit: createTaxonomy,
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
				tabs={activeTabs.slice(0, 1)}
				linkProps={(props: { href: string }) => ({
					...props,
					to: generatePath(`${MODULE_PATHS.create}/${props.href}`),
					component: Link,
				})}
				title={pageTitle}
			>
				<ContextHeaderTopSection>{breadcrumbs}</ContextHeaderTopSection>
			</ContextHeader>
			<Container>
				<AlertContainer
					toastClassName="u-margin-bottom"
					containerId={ALERT_CONTAINER_IDS.create}
				/>
				<DataLoader loadingState={false} render={renderChildRoutes} />
			</Container>
		</>
	);
};

export default TaxonomyCreate;
