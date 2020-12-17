import { number, object, string } from 'yup';

export const TERM_FORM_VALIDATION_SCHEMA = object().shape({
	label: string().required('Label is een verplicht veld'),
	description: string(),
	parentTermId: number(),
});
