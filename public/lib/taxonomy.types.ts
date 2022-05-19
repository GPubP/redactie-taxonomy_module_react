import { ModuleRouteConfig, RouteConfigComponentProps } from '@redactie/redactie-core';
import { AlertProps, ContextHeaderTab, Language, LanguageErrors } from '@redactie/utils';

import { CreateTaxonomyPayload } from './services/taxonomies';
import { TaxonomyTerm } from './services/taxonomyTerms';
import { TaxonomyDetailModel } from './store/taxonomies';

export interface TaxonomyModuleRouteProps<
	Params extends { [K in keyof Params]?: string } = Record<string, string>
> extends RouteConfigComponentProps<Params> {
	routes: ModuleRouteConfig[];
	tenantId: string;
}

export interface TaxonomyRouteParams {
	taxonomyId: string;
}

export interface TaxonomyRouteProps<Params = TaxonomyRouteParams>
	extends RouteConfigComponentProps<Params> {
	routes: ModuleRouteConfig[];
}

export interface TaxonomyDetailRouteProps<Params = TaxonomyRouteParams>
	extends RouteConfigComponentProps<Params> {
	readonly allowedPaths?: string[];
	readonly taxonomy: TaxonomyDetailModel;
	onCancel: () => void;
	onSubmit: (data: CreateTaxonomyPayload | TaxonomyDetailModel, tab: ContextHeaderTab) => void;
}

export interface NestedTaxonomyTerm extends TaxonomyTerm {
	position: number;
	children?: NestedTaxonomyTerm[];
}

export type AlertMessages<T extends string | number | symbol> = Record<
	T,
	{ [key in 'success' | 'error']?: AlertProps }
>;

export enum PublishStatus {
	Draft = 'draft',
	Published = 'published',
}

export interface LanguageHeaderContextType {
	activeLanguage: Language;
	setErrors: (errors: LanguageErrors) => void;
}
