import { number, object, ObjectSchema, string } from 'yup';

export const TERM_FORM_VALIDATION_SCHEMA = (
	terms: string[]
): ObjectSchema<any, any, any, any, any> =>
	object().shape({
		label: string()
			.required('Label is een verplicht veld')
			.notOneOf(terms, 'Deze term bestaat reeds'),
		description: string(),
		parentTermId: number(),
	});
