import { SelectOption } from '@redactie/utils';
import { FieldProps } from 'formik';

import { TaxonomyTerm } from '../../services/taxonomyTerms';
import { TaxonomySelectMethods } from '../Fields/TaxonomySelect/TaxonomySelect.types';

export interface TaxonomyTermSelectProps extends FieldProps {
	label: string;
	description: string;
	placeholder?: string;
	placeholderValue?: number | string;
	allTerms: TaxonomyTerm[];
	selectionMethod?: TaxonomySelectMethods;
	required?: boolean;
}

export interface CascaderOption {
	label: string;
	value: number | null;
	children?: CascaderOption[];
	parentTermId?: number;
}

export interface TermSelectOption extends Omit<SelectOption, 'value'> {
	value?: string | number;
}
