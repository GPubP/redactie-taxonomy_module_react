import { object, string } from 'yup';

import { PUBLISH_STATUS_OPTIONS } from '../../../taxonomy.const';
import { SelectOption } from '../../../taxonomy.types';

export const TAXONOMY_SETTINGS_VALIDATION_SCHEMA = object().shape({
	label: string().required('Naam is een verplicht veld'),
	description: string(),
	publishStatus: string().required('Status is een verplicht veld'),
});

export const SETTINGS_PUBLISH_STATUS_OPTIONS: SelectOption[] = [
	{
		label: 'Selecteer een status',
		value: '',
		disabled: true,
	},
	...PUBLISH_STATUS_OPTIONS,
];
