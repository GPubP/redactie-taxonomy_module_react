import { FormikProps, FormikValues } from 'formik';
import { ReactNode, Ref } from 'react';

import { TaxonomyTerm } from '../../../services/taxonomyTerms';
import { TaxonomyTermDetailModel } from '../../../store/taxonomyTerms';
import { FormikChildrenFn } from '../../../taxonomy.types';

export interface TaxonomyTermFormProps {
	children?: FormikChildrenFn<TaxonomyTermDetailModel> | ReactNode;
	formikRef: Ref<FormikProps<FormikValues>>;
	isUpdate?: boolean;
	allTerms: TaxonomyTerm[];
	taxonomyTerm?: TaxonomyTerm;
	onSubmit: (values: any) => void;
}
