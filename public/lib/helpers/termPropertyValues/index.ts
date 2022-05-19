import { LanguageModel } from '@redactie/language-module';
import { omit } from 'ramda';

import { LanguagePropertyValues } from '../../components';
import { TermPropertyValue } from '../../services/taxonomyTerms';
import { TERM_LANG_PROPERTY_VALUE_PREFIX } from '../../taxonomy.const';

export const parseTermFormTranslations = (
	values: TermPropertyValue[] | undefined,
	languages: LanguageModel[]
): LanguagePropertyValues | void => {
	if (!values) {
		return;
	}

	return values.reduce((acc, curr) => {
		const isLanguageProperty = curr.key.startsWith(TERM_LANG_PROPERTY_VALUE_PREFIX);
		const languageKey = curr.key.replace(TERM_LANG_PROPERTY_VALUE_PREFIX, '');
		const isCurrentLanguage = languages.some(lang => lang.key === languageKey);

		if (!isLanguageProperty || !isCurrentLanguage) {
			return acc;
		}

		return { ...acc, [languageKey]: curr.value };
	}, {});
};

export const parseTermPropertyValues = (
	propertiesObject: Record<string, string> | undefined
): TermPropertyValue[] => {
	if (!propertiesObject) {
		return [];
	}

	return Object.keys(omit(['multiLanguage'], propertiesObject)).reduce((acc, curr) => {
		return [
			...acc,
			{
				id: 0,
				key: `${TERM_LANG_PROPERTY_VALUE_PREFIX}${curr}`,
				value: propertiesObject[curr],
			},
		];
	}, [] as TermPropertyValue[]);
};
