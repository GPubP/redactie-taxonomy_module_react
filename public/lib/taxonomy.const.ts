import { BreadcrumbOptions } from '@redactie/redactie-core';
import { NavigateGenerateFn } from '@redactie/utils';

export const TENANT_ROOT = '/:tenantId';
export const root = '/taxonomie';

export const MODULE_PATHS = {
	admin: '/dashboard',
	contentTypes: '/content-types',

	root,
	overview: `${root}/overzicht`,

	create: `${root}/aanmaken`,

	detail: `${root}/:taxonomyUuid`,
};

export const BREADCRUMB_OPTIONS = (generatePath: NavigateGenerateFn): BreadcrumbOptions => ({
	excludePaths: ['/', `${TENANT_ROOT}`, `${TENANT_ROOT}${root}`],
	extraBreadcrumbs: [
		{
			name: 'Home',
			target: generatePath(MODULE_PATHS.admin),
		},
		{
			name: 'Structuur',
			target: '',
		},
	],
});
