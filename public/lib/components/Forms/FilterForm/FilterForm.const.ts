import { object, string } from 'yup';

import { PUBLISH_STATUS_OPTIONS } from '../../../taxonomy.const';

export const FILTER_FORM_VALIDATION_SCHEMA = object().shape({
	label: string(),
	publishStatus: string(),
});

export const FILTER_PUBLISH_STATUS_OPTIONS = [
	{
		label: 'Alle',
		value: '',
	},
	...PUBLISH_STATUS_OPTIONS,
];
