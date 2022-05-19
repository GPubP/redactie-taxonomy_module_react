import { LanguageModel } from '@redactie/language-module';
import { MultilanguageYup } from '@redactie/utils';
import { ObjectSchema } from 'yup';

export const TERM_FORM_VALIDATION_SCHEMA = (
	terms: string[],
	languages: LanguageModel[],
	multiLanguage: boolean
): ObjectSchema<any, any, any, any, any> =>
	MultilanguageYup.object().shape({
		label: multiLanguage
			? MultilanguageYup.string()
			: MultilanguageYup.string()
					.required('Label is een verplicht veld')
					.notOneOf(terms, 'Deze term bestaat reeds'),
		description: MultilanguageYup.string(),
		parentTermId: MultilanguageYup.number(),
		...(multiLanguage
			? {
					propertyValues: MultilanguageYup.object().validateMultiLanguage(
						languages,
						MultilanguageYup.string().required('Label is een verplicht veld')
					),
			  }
			: null),
	});

export const TERM_FORM_LABEL_FIELD_PROPS = {
	label: 'Naam',
	description:
		'Geef de taxonomie term een korte en duidelijke naam. Deze naam verschijnt in de applicatie.',
};
