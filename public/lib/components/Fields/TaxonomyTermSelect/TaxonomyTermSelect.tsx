import { InputFieldProps } from '@redactie/form-renderer-module';
import { DataLoader, useSiteContext } from '@redactie/utils';
import React, { FC, ReactElement, useEffect, useState } from 'react';

import { TaxonomyTerm, taxonomyTermsApiService } from '../../../services/taxonomyTerms';
import { TaxonomyTermSelect as TermSelect } from '../../TaxonomyTermSelect';

const TaxonomyTermSelect: FC<InputFieldProps> = ({ fieldProps, fieldSchema }) => {
	const { setValue } = fieldProps.form.getFieldHelpers(fieldProps.field.name);
	const { config = { description: '' }, label = '' } = fieldSchema;
	const { description, taxonomyConfig, required } = config;
	const { siteId } = useSiteContext();

	/**
	 * Hooks
	 */

	const [isLoading, setIsLoading] = useState(true);
	const [terms, setTerms] = useState<TaxonomyTerm[]>([]);

	// Fetch terms
	useEffect(() => {
		if (taxonomyConfig?.taxonomyId) {
			taxonomyTermsApiService
				.getTerms(taxonomyConfig?.taxonomyId, siteId)
				.then(response => {
					if (response?._embedded) {
						const selectedTerm = response?._embedded.find(
							term => term.id === Number(fieldProps.field.value)
						);

						if (!selectedTerm) {
							setValue('');
						}

						setTerms(response._embedded);
					}
				})
				.finally(() => setIsLoading(false));
		} else {
			setIsLoading(false);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [fieldProps.field.value, siteId, taxonomyConfig]);

	/**
	 * Render
	 */

	const renderField = (): ReactElement | null => {
		return (
			<TermSelect
				{...fieldProps}
				allTerms={terms}
				description={description}
				label={label}
				placeholder="Selecteer een term"
				selectionMethod={taxonomyConfig?.selectionMethod}
				required={required}
			/>
		);
	};

	return <DataLoader loadingState={isLoading} render={renderField} />;
};

export default TaxonomyTermSelect;
