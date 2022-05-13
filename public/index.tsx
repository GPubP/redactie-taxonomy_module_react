import Core from '@redactie/redactie-core';
import { RenderChildRoutes, TenantContext } from '@redactie/utils';
import React, { FC, useMemo } from 'react';

import { InputTaxonomyTermSelect, TaxonomySelect, TaxonomyTermView } from './lib/components';
import { formRendererConnector, rolesRightsConnector } from './lib/connectors';
import { registerTranslations } from './lib/i18next';
import { MODULE_PATHS } from './lib/taxonomy.const';
import { TaxonomyModuleRouteProps } from './lib/taxonomy.types';
import {
	TaxonomyCreate,
	TaxonomyDetailSettings,
	TaxonomyDetailTerms,
	TaxonomyOverview,
	TaxonomyTermDetail,
	TaxonomyUpdate,
} from './lib/views';

registerTranslations();

const TaxonomyRoot: FC<TaxonomyModuleRouteProps> = ({ route, tenantId }) => {
	const guardsMeta = useMemo(() => ({ tenantId }), [tenantId]);

	return (
		<TenantContext.Provider value={{ tenantId }}>
			<RenderChildRoutes routes={route.routes} guardsMeta={guardsMeta} />
		</TenantContext.Provider>
	);
};

Core.routes.register({
	path: MODULE_PATHS.root,
	breadcrumb: false,
	component: TaxonomyRoot,
	redirect: MODULE_PATHS.overview,
	navigation: {
		label: 'Taxonomie',
		order: 3,
		parentPath: MODULE_PATHS.contentTypes,
		canShown: [
			rolesRightsConnector.canShowns.securityRightsTenantCanShown([
				rolesRightsConnector.securityRights.read,
			]),
		],
	},
	guardOptions: {
		guards: [
			rolesRightsConnector.guards.securityRightsTenantGuard([
				rolesRightsConnector.securityRights.read,
			]),
		],
	},
	routes: [
		{
			path: MODULE_PATHS.overview,
			breadcrumb: false,
			component: TaxonomyOverview,
		},
		{
			path: MODULE_PATHS.create,
			breadcrumb: false,
			component: TaxonomyCreate,
			redirect: MODULE_PATHS.createSettings,
			guardOptions: {
				guards: [
					rolesRightsConnector.guards.securityRightsTenantGuard([
						rolesRightsConnector.securityRights.create,
					]),
				],
			},
			routes: [
				{
					path: MODULE_PATHS.createSettings,
					breadcrumb: false,
					component: TaxonomyDetailSettings,
				},
			],
		},
		{
			path: MODULE_PATHS.terms.create,
			breadcrumb: false,
			component: TaxonomyTermDetail,
		},
		{
			path: MODULE_PATHS.terms.detail,
			breadcrumb: false,
			component: TaxonomyTermDetail,
		},
		{
			path: MODULE_PATHS.detail,
			breadcrumb: false,
			component: TaxonomyUpdate,
			redirect: MODULE_PATHS.detailSettings,
			routes: [
				{
					path: MODULE_PATHS.detailSettings,
					breadcrumb: false,
					component: TaxonomyDetailSettings,
				},
				{
					path: MODULE_PATHS.detailTerms,
					breadcrumb: false,
					component: TaxonomyDetailTerms,
				},
			],
		},
	],
});

formRendererConnector.api.fieldRegistry.add([
	{
		name: 'taxonomyFieldSettings',
		module: 'taxonomy',
		component: TaxonomySelect,
	},
	{
		name: 'taxonomySelect',
		module: 'taxonomy',
		component: InputTaxonomyTermSelect,
		viewComponent: TaxonomyTermView,
	},
]);
