import Core from '@redactie/redactie-core';
import { RenderChildRoutes, TenantContext } from '@redactie/utils';
import React, { FC, useMemo } from 'react';

import { rolesRightsConnector } from './lib/connectors';
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
	component: TaxonomyRoot,
	breadcrumb: null,
	redirect: MODULE_PATHS.overview,
	navigation: {
		label: 'Taxonomie',
		order: 2,
		parentPath: MODULE_PATHS.contentTypes,
		canShown: [
			rolesRightsConnector.canShowns.securityRightsTenantCanShown([
				// TODO: Uncomment this line when the securityright are set
				// rolesRightsConnector.securityRights.read,
			]),
		],
	},
	guardOptions: {
		guards: [
			rolesRightsConnector.guards.securityRightsTenantGuard([
				// TODO: Uncomment this line when the securityright are set
				// rolesRightsConnector.securityRights.read,
			]),
		],
	},
	routes: [
		{
			path: MODULE_PATHS.overview,
			component: TaxonomyOverview,
		},
		{
			path: MODULE_PATHS.create,
			component: TaxonomyCreate,
			redirect: MODULE_PATHS.createSettings,
			guardOptions: {
				guards: [
					rolesRightsConnector.guards.securityRightsTenantGuard([
						// TODO: Uncomment this line when the securityright are set
						// rolesRightsConnector.securityRights.create,
					]),
				],
			},
			routes: [
				{
					path: MODULE_PATHS.createSettings,
					component: TaxonomyDetailSettings,
				},
			],
		},
		{
			path: MODULE_PATHS.terms.create,
			breadcrumb: null,
			component: TaxonomyTermDetail,
		},
		{
			path: MODULE_PATHS.terms.detail,
			breadcrumb: null,
			component: TaxonomyTermDetail,
		},
		{
			path: MODULE_PATHS.detail,
			breadcrumb: null,
			component: TaxonomyUpdate,
			redirect: MODULE_PATHS.detailSettings,
			routes: [
				{
					path: MODULE_PATHS.detailSettings,
					component: TaxonomyDetailSettings,
				},
				{
					path: MODULE_PATHS.detailTerms,
					component: TaxonomyDetailTerms,
				},
			],
		},
	],
});
