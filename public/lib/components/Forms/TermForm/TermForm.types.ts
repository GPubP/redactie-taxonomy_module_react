import { LanguageModel } from '@redactie/language-module';
import { FormikChildrenFn } from '@redactie/utils';
import { FormikProps } from 'formik';
import { ReactNode, Ref } from 'react';

import { TaxonomyTerm } from '../../../services/taxonomyTerms';
import { TaxonomyTermDetailModel } from '../../../store/taxonomies';

export interface TaxonomyTermFormProps {
	allTerms: TaxonomyTerm[];
	children?: FormikChildrenFn<TaxonomyTermDetailModel> | ReactNode;
	className?: string;
	formikRef: Ref<FormikProps<TermFormValues>>;
	initialValues: TermFormValues | null;
	languages: LanguageModel[];
	multiLanguage: boolean;
	onSubmit: (values: TermFormValues) => void;
	taxonomyTerm?: TaxonomyTerm;
}

export interface TermFormValues {
	label: string;
	description: string;
	parentTermId?: number;
	propertyValues?: LanguagePropertyValues & {
		multiLanguage: boolean;
	};
}

export interface LanguagePropertyValues {
	[key: string]: string;
}
