import { ModuleRouteConfig, RouteConfigComponentProps } from '@redactie/redactie-core';
import { AlertProps } from '@redactie/utils';
import { FormikProps, FormikValues } from 'formik';
import { ReactNode } from 'react';

import { CreateTaxonomyPayload } from './services/taxonomies';
import { TaxonomyDetailModel } from './store/taxonomies';

export interface TaxonomyModuleRouteProps<Params extends { [K in keyof Params]?: string } = {}>
	extends RouteConfigComponentProps<Params> {
	routes: ModuleRouteConfig[];
	tenantId: string;
}

export interface TaxonomyRouteParams {
	taxonomyUuid: string;
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
	onSubmit: (data: CreateTaxonomyPayload | TaxonomyDetailModel, tab: Tab) => void;
}

// TODO: move to utils types

export type AlertMessages<T extends string | number | symbol> = Record<
	T,
	{ [key in 'success' | 'error']?: AlertProps }
>;

export interface TableColumn<RowData = unknown> {
	label: string;
	value?: string;
	component?: (value: any, rowData: RowData, rowIndex: number) => ReactNode;
	headerComponent?: (value: any) => ReactNode;
	format?: (value: any, col: TableColumn<RowData>, rowData: RowData, rowIndex: number) => string;
	hidden?: boolean;
	disabled?: boolean;
	disableSorting?: boolean;
	classList?: string[];
	fallback?: string;
}

export interface FilterItem {
	key: string;
	valuePrefix: string;
	value: string;
}

export type FormikChildrenFn<Values = FormikValues> = (
	formikProps: FormikProps<Values>
) => ReactNode;

export interface SelectOption {
	label: string;
	value: string;
	disabled?: boolean;
}

export interface Tab {
	id?: string;
	name: string;
	target: string;
	active: boolean;
	disabled?: boolean;
}
