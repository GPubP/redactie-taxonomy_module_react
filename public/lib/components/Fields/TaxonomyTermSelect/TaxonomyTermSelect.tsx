import { InputFieldProps } from '@redactie/form-renderer-module';
import { DataLoader } from '@redactie/utils';
import React, { FC, ReactElement, useEffect, useState } from 'react';

import { TaxonomyTerm, taxonomyTermsApiService } from '../../../services/taxonomyTerms';
import { TaxonomyTermSelect as TermSelect } from '../../TaxonomyTermSelect';

const TaxonomyTermSelect: FC<InputFieldProps> = ({ fieldProps, fieldSchema }) => {
	const { config = { description: '' }, label = '' } = fieldSchema;
	const { description, taxonomyConfig } = config;
	const { field } = fieldProps;

	/**
	 * Hooks
	 */

	const [isLoading, setIsLoading] = useState(true);
	const [terms, setTerms] = useState<TaxonomyTerm[]>([]);

	// Fetch terms
	useEffect(() => {
		if (taxonomyConfig?.taxonomyId) {
			taxonomyTermsApiService
				.getTerms(taxonomyConfig?.taxonomyId)
				.then(response => {
					if (response?._embedded) {
						setTerms(response._embedded);
					}
				})
				.finally(() => setIsLoading(false));
		} else {
			setIsLoading(false);
		}
	}, [taxonomyConfig]);

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
				value={parseInt(field.value)}
			/>
		);
	};

	return <DataLoader loadingState={isLoading} render={renderField} />;
};

export default TaxonomyTermSelect;
