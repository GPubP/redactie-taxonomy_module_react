import { SelectOption } from '@redactie/utils';
import { boolean, object, ObjectSchema, string } from 'yup';

import { TaxonomySettings } from '../../../services/taxonomies';
import { PUBLISH_STATUS_OPTIONS } from '../../../taxonomy.const';

export const TAXONOMY_SETTINGS_VALIDATION_SCHEMA: ObjectSchema<TaxonomySettings> = object().shape({
	label: string().required('Naam is een verplicht veld'),
	description: string(),
	publishStatus: string().required('Status is een verplicht veld'),
	multiLanguage: boolean(),
});

export const SETTINGS_PUBLISH_STATUS_OPTIONS: SelectOption[] = [
	{
		label: 'Selecteer een status',
		value: '',
		disabled: true,
	},
	...PUBLISH_STATUS_OPTIONS,
];
