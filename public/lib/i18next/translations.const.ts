import { translationsConnector } from '../connectors';

const tKey = translationsConnector.core.tKey;

export const MODULE_TRANSLATIONS = Object.freeze({
	SETTINGS_MULTI_LANGUAGE_CARD_TITLE: tKey('SETTINGS_MULTI_LANGUAGE_CARD_TITLE', 'Vertalen'),
	SETTINGS_MULTI_LANGUAGE_CARD_DESCRIPTION: tKey(
		'SETTINGS_MULTI_LANGUAGE_CARD_DESCRIPTION',
		'Bepaal of de termen in deze taxonomie vertaald moeten worden. Indien deze niet in de frontend gebruikt worden is een vertaling onnodig.'
	),
	SETTINGS_MULTI_LANGUAGE_CARD_CHECKBOX_LABEL: tKey(
		'SETTINGS_MULTI_LANGUAGE_CARD_CHECKBOX_LABEL',
		'Inhoud vertalen'
	),
	SETTINGS_FORM_LABEL_FIELD_LABEL: tKey('SETTINGS_FORM_LABEL_FIELD_LABEL', 'Naam'),
	SETTINGS_FORM_LABEL_FIELD_DESCRIPTION: tKey(
		'SETTINGS_FORM_LABEL_FIELD_DESCRIPTION',
		'Geef de taxonomie een korte en duidelijke naam. Deze naam verschijnt in de applicatie.'
	),
	SETTINGS_FORM_DESCRIPTION_FIELD_LABEL: tKey(
		'SETTINGS_FORM_DESCRIPTION_FIELD_LABEL',
		'Beschrijving'
	),
	SETTINGS_FORM_DESCRIPTION_FIELD_DESCRIPTION: tKey(
		'SETTINGS_FORM_DESCRIPTION_FIELD_DESCRIPTION',
		'Geef de taxonomie een duidelijke beschrijving. Deze wordt gebruikt in het overzicht.'
	),
	SETTINGS_FORM_STATUS_FIELD_LABEL: tKey('SETTINGS_FORM_STATUS_FIELD_LABEL', 'Status'),
	SETTINGS_FORM_STATUS_FIELD_DESCRIPTION: tKey(
		'SETTINGS_FORM_STATUS_FIELD_DESCRIPTION',
		'Selecteer een status.'
	),
});
