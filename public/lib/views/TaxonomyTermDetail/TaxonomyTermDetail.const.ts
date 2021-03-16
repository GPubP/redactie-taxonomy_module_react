import { TermFormValues } from '../../components';
import { TaxonomyTermDetailModel } from '../../store/taxonomies';
import { MODULE_PATHS, TENANT_ROOT } from '../../taxonomy.const';

export const TERM_DETAIL_ALLOWED_PATHS = [`${TENANT_ROOT}${MODULE_PATHS.terms.detail}`];

export const INITIAL_TERM_VALUE: TermFormValues = {
	label: '',
	description: '',
};

export const TERM_VALUE_KEYS: (keyof TaxonomyTermDetailModel)[] = [
	'label',
	'description',
	'parentTermId',
];
