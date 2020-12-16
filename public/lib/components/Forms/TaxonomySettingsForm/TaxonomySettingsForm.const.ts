import { object, string } from 'yup';

export const TAXONOMY_SETTINGS_VALIDATION_SCHEMA = object().shape({
	name: string().required('Naam is een verplicht veld'),
	description: string(),
	status: string().required('Status is een verplicht veld'),
});
