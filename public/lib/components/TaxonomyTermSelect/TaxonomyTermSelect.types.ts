import { FieldProps } from 'formik';

import { TaxonomyTerm } from '../../services/taxonomyTerms';

export interface TaxonomyTermSelectProps extends FieldProps {
	label: string;
	description: string;
	value?: number;
	allTerms: TaxonomyTerm[];
}

export interface CascaderOption {
	label: string;
	value: number;
	children: CascaderOption[];
	parentTermId: number;
}
