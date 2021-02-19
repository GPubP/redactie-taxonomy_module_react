import { FormikProps } from 'formik';
import { ReactNode, Ref } from 'react';

import { TaxonomyTerm } from '../../../services/taxonomyTerms';
import { TaxonomyTermDetailModel } from '../../../store/taxonomies';
import { FormikChildrenFn } from '../../../taxonomy.types';

export interface TaxonomyTermFormProps {
	allTerms: TaxonomyTerm[];
	children?: FormikChildrenFn<TaxonomyTermDetailModel> | ReactNode;
	formikRef: Ref<FormikProps<TermFormValues>>;
	initialValues: TermFormValues | null;
	onSubmit: (values: TermFormValues) => void;
	taxonomyTerm?: TaxonomyTerm;
}

export interface TermFormValues {
	label: string;
	description: string;
	parentTermId?: number;
}
