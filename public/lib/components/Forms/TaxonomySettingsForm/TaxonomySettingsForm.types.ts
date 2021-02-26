import { FormikChildrenFn } from '@redactie/utils';
import { FormikProps, FormikValues } from 'formik';
import { ReactNode, Ref } from 'react';

import { TaxonomyDetailResponse } from '../../../services/taxonomies';
import { TaxonomyDetailModel } from '../../../store/taxonomies';

export interface TaxonomySettingFormProps {
	children?: FormikChildrenFn<TaxonomyDetailModel> | ReactNode;
	formikRef: Ref<FormikProps<FormikValues>>;
	isUpdate?: boolean;
	taxonomy: TaxonomyDetailResponse;
	onSubmit: (values: any) => void;
}
