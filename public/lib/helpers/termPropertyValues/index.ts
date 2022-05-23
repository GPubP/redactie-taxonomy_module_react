import { LanguageModel } from '@redactie/language-module';
import { omit } from 'ramda';

import { LanguagePropertyValues } from '../../components';
import { TermPropertyValue } from '../../services/taxonomyTerms';
import { TermLanguagePropertyPrefix } from '../../taxonomy.types';

export const parseTermFormTranslations = (
	values: TermPropertyValue[] | undefined,
	languages: LanguageModel[],
	defaultValue?: string
): LanguagePropertyValues | void => {
	if (!values) {
		return;
	}

	return languages.reduce((acc, curr) => {
		const languageKey = curr.key;
		const propertyValue = values.find(
			value => value.key === `${TermLanguagePropertyPrefix.Label}${languageKey}`
		);

		return { ...acc, [languageKey]: propertyValue?.value || defaultValue };
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
				key: `${TermLanguagePropertyPrefix.Label}${curr}`,
				value: propertiesObject[curr],
			},
		];
	}, [] as TermPropertyValue[]);
};
