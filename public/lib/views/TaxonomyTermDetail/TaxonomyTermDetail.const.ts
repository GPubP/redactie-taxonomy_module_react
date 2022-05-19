import { LanguageModel } from '@redactie/language-module';

import { LanguagePropertyValues, TermFormValues } from '../../components';
import { TaxonomyTermDetailModel } from '../../store/taxonomies';
import { MODULE_PATHS, TENANT_ROOT } from '../../taxonomy.const';

export const TERM_DETAIL_ALLOWED_PATHS = [`${TENANT_ROOT}${MODULE_PATHS.terms.detail}`];

export const INITIAL_TERM_VALUE = (
	multiLanguage: boolean,
	languages: LanguageModel[]
): TermFormValues => {
	return {
		label: '',
		description: '',
		...(languages && multiLanguage
			? {
					propertyValues: {
						multiLanguage,
						...languages.reduce(
							(acc, curr) => ({ ...acc, [curr.key]: '' }),
							{} as LanguagePropertyValues
						),
					} as TermFormValues['propertyValues'],
			  }
			: null),
	};
};

export const TERM_VALUE_KEYS: (keyof TaxonomyTermDetailModel)[] = [
	'label',
	'description',
	'parentTermId',
];
