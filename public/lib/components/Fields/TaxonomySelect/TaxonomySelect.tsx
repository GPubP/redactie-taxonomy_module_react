import { RadioGroup, Select } from '@acpaas-ui/react-components';
import { InputFieldProps } from '@redactie/form-renderer-module';
import { DataLoader } from '@redactie/utils';
import { Field } from 'formik';
import React, { ChangeEvent, FC, ReactElement, useEffect, useMemo, useState } from 'react';

import { taxonomiesApiService, Taxonomy } from '../../../services/taxonomies';
import { taxonomyTermsApiService } from '../../../services/taxonomyTerms';
import { SelectOption } from '../../../taxonomy.types';

import {
	INITIAL_TAXONOMY_VALUE,
	SELECTION_METHOD_OPTIONS,
	TAXONOMY_DEFAULT_OPTION,
} from './TaxonomySelect.const';
import { TaxonomySelectMethods, TaxonomySelectValue } from './TaxonomySelect.types';

const TaxonomySelect: FC<InputFieldProps> = ({ fieldHelperProps, fieldProps }) => {
	const { field } = fieldProps;
	const value = (field.value as unknown) as TaxonomySelectValue;

	/**
	 * Hooks
	 */

	const [isLoading, setIsLoading] = useState(true);
	const [isLoadingTerms, setIsLoadingTerms] = useState(false);
	const [taxonomies, setTaxonomies] = useState<Taxonomy[]>([]);
	const [showSelectionMethod, setShowSelectionMethod] = useState(
		[TaxonomySelectMethods.AutoComplete, TaxonomySelectMethods.Dropdown].includes(
			value?.selectionMethod as TaxonomySelectMethods
		) || false
	);
	const taxonomyOptions = useMemo<SelectOption[]>(() => {
		const defaultOptions = [TAXONOMY_DEFAULT_OPTION];

		if (taxonomies.length) {
			const options = taxonomies.map(taxonomy => ({
				label: taxonomy.label,
				value: `${taxonomy.id}`,
			}));

			return defaultOptions.concat(options);
		}
		return defaultOptions;
	}, [taxonomies]);

	// Fetch taxonomies and set initial value
	useEffect(() => {
		if (!value) {
			fieldHelperProps.setValue(INITIAL_TAXONOMY_VALUE);
		}

		taxonomiesApiService
			.getTaxonomies()
			.then(response => {
				if (response?._embedded?.length) {
					setTaxonomies(response._embedded);
				}
			})
			.finally(() => setIsLoading(false));

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	/**
	 * Methods
	 */

	const onTaxonomyChange = async (e: ChangeEvent<HTMLSelectElement>): Promise<void> => {
		const selectedTaxonomy = taxonomies.find(t => t.id === parseInt(e.target.value));
		const newValue: TaxonomySelectValue = { ...value, taxonomyId: e.target.value };
		fieldHelperProps.setValue(newValue);

		if (selectedTaxonomy) {
			setIsLoadingTerms(true);

			const terms = await taxonomyTermsApiService
				.getTerms(selectedTaxonomy.id)
				.then(response => response?._embedded || [])
				.finally(() => setIsLoadingTerms(false));

			const hasNestedTerms = (terms || []).some(
				term => term.parentTermId && term.parentTermId !== term.id
			);

			if (hasNestedTerms) {
				// Always use cascader when terms are nested
				newValue.selectionMethod = TaxonomySelectMethods.Cascader;
				fieldHelperProps.setValue(newValue);
			}

			setShowSelectionMethod(!hasNestedTerms);
		}
	};

	/**
	 * Render
	 */

	const renderFormFields = (): ReactElement | null => {
		return (
			<>
				<h3 className="h6 u-margin-bottom">Taxonomie</h3>
				<Field
					as={Select}
					label="Selecteer een taxonomie"
					id={`${field.name}.taxonomyId`}
					loading={isLoadingTerms}
					name={`${field.name}.taxonomyId`}
					onChange={onTaxonomyChange}
					options={taxonomyOptions}
				/>
				<div className="a-input u-margin-bottom">
					<small>Bepaal van welke taxonomie de redacteur termen mag selecteren.</small>
				</div>
				{showSelectionMethod && !isLoadingTerms && (
					<>
						<hr />
						<h3 className="h6 u-margin-bottom">Selectiemethode</h3>
						<Field
							as={RadioGroup}
							description="Bepaal op welke manier de redacteur de termen kan ingeven: door termen vrij te zoeken (autocomplete) of door ze te selecteren uit een lijst (dropdown)."
							label="Bepaal de selectiemethode"
							id={`${field.name}.selectionMethod`}
							name={`${field.name}.selectionMethod`}
							options={SELECTION_METHOD_OPTIONS}
						/>
					</>
				)}
			</>
		);
	};

	return <DataLoader loadingState={isLoading} render={renderFormFields} />;
};

export default TaxonomySelect;
