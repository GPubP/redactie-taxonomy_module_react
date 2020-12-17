import { BreadcrumbOptions } from '@redactie/redactie-core';
import { NavigateGenerateFn } from '@redactie/utils';

import { Tab } from './taxonomy.types';

export const TENANT_ROOT = '/:tenantId';
export const root = '/taxonomie';
export const detail = `${root}/:taxonomyUuid`;

export const MODULE_PATHS = {
	admin: '/dashboard',
	contentTypes: '/content-types',

	root,
	overview: `${root}/overzicht`,

	create: `${root}/aanmaken`,
	createSettings: `${root}/aanmaken/instellingen`,

	detail: `${root}/:taxonomyUuid`,
	detailSettings: `${root}/:taxonomyUuid/instellingen`,
	detailTerms: `${root}/:taxonomyUuid/termen`,

	terms: {
		create: `${detail}/termen/aanmaken`,

		detail: `${detail}/termen/:termId`,
	},
};

export const BREADCRUMB_OPTIONS = (generatePath: NavigateGenerateFn): BreadcrumbOptions => ({
	excludePaths: [
		'/',
		`${TENANT_ROOT}`,
		`${TENANT_ROOT}${root}`,
		`${TENANT_ROOT}${MODULE_PATHS.terms.detail}`,
	],
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

export const DETAIL_TAB_MAP = {
	settings: {
		name: 'Instellingen',
		target: 'instellingen',
		active: true,
	},
	terms: {
		name: 'Termen',
		target: 'termen',
		active: false,
	},
};

export const DETAIL_TABS: Tab[] = [DETAIL_TAB_MAP.settings, DETAIL_TAB_MAP.terms];

export const PUBLISH_STATUS_OPTIONS = [
	{
		label: 'Werkversie',
		value: 'draft',
	},
	{
		label: 'Gepubliceerd',
		value: 'published',
	},
];

export const ALERT_CONTAINER_IDS = {
	create: 'taxonomy-create',
	detailSettings: 'taxonomy-detail-settings',
	detailTerms: 'taxonomy-detail-terms',
};
