import { I18NextTranslations } from '@redactie/translations-module';

import translations from '../../assets/i18n/locales/template.json';
import { translationsConnector } from '../connectors';
import { CONFIG } from '../taxonomy.const';

export * from './translations.const';

export const registerTranslations = (): void => {
	translationsConnector.modules.addTranslation(
		CONFIG.name,
		'nl_BE',
		translations as I18NextTranslations
	);
};
