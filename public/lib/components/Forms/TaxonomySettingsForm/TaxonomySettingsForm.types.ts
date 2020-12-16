import { FormikProps, FormikValues } from 'formik';
import { Ref } from 'react';

import { TaxonomyDetailResponse } from '../../../services/taxonomies';

export interface TaxonomySettingFormProps {
	formikRef: Ref<FormikProps<FormikValues>>;
	taxonomy: TaxonomyDetailResponse;
	onSubmit: (values: any) => void;
}
