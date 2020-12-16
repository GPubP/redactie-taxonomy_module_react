import { Select, TextField } from '@acpaas-ui/react-components';
import { Filter, FilterBody } from '@acpaas-ui/react-editorial-components';
import { Field, Formik } from 'formik';
import React, { FC } from 'react';

import { CORE_TRANSLATIONS, useCoreTranslation } from '../../../connectors';

import { FILTER_FORM_VALIDATION_SCHEMA, FILTER_PUBLISH_STATUS_OPTIONS } from './FilterForm.const';
import { FilterFormProps } from './FilterForm.types';

const FilterForm: FC<FilterFormProps> = ({
	activeFilters,
	initialState,
	clearActiveFilter,
	onCancel,
	onSubmit,
}) => {
	/**
	 * Hooks
	 */

	const [t] = useCoreTranslation();

	/**
	 * Render
	 */

	return (
		<Formik
			initialValues={initialState}
			onSubmit={onSubmit}
			validationSchema={FILTER_FORM_VALIDATION_SCHEMA}
			enableReinitialize
		>
			{({ resetForm, submitForm }) => {
				return (
					<Filter
						title={t(CORE_TRANSLATIONS.FILTER_TITLE)}
						noFilterText="Geen filters beschikbaar"
						onConfirm={submitForm}
						onClean={() => {
							resetForm();
							onCancel();
						}}
						confirmText={t(CORE_TRANSLATIONS.FILTER_APPLY)}
						cleanText={t(CORE_TRANSLATIONS.FILTER_CLEAR)}
						activeFilters={activeFilters}
						onFilterRemove={clearActiveFilter}
					>
						<FilterBody>
							<div className="col-xs-12 col-md-6 u-margin-bottom">
								<Field
									as={TextField}
									label="Zoeken"
									name="search"
									iconright="search"
									placeholder="Zoek op woord"
								/>
							</div>
							<div className="col-xs-12 col-md-6 sm:u-margin-bottom">
								<Field
									as={Select}
									label="Status"
									name="status"
									options={FILTER_PUBLISH_STATUS_OPTIONS}
									placeholder="Status"
								/>
							</div>
						</FilterBody>
					</Filter>
				);
			}}
		</Formik>
	);
};

export default FilterForm;
