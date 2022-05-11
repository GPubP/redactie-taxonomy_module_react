import { Checkbox, Select, Textarea, TextField } from '@acpaas-ui/react-components';
import { ErrorMessage, FormikChildrenFn } from '@redactie/utils';
import classnames from 'classnames';
import { Field, Formik, isFunction } from 'formik';
import React, { FC } from 'react';

import { getFieldState } from '../../../helpers';
import { TaxonomyDetailModel } from '../../../store/taxonomies';

import {
	SETTINGS_PUBLISH_STATUS_OPTIONS,
	TAXONOMY_SETTINGS_VALIDATION_SCHEMA,
} from './TaxonomySettingsForm.const';
import { TaxonomySettingFormProps } from './TaxonomySettingsForm.types';

const TaxonomySettingsForm: FC<TaxonomySettingFormProps> = ({
	children,
	formikRef,
	isUpdate = false,
	taxonomy,
	onSubmit,
}) => {
	return (
		<Formik
			innerRef={instance => isFunction(formikRef) && formikRef(instance)}
			initialValues={taxonomy}
			onSubmit={onSubmit}
			validationSchema={TAXONOMY_SETTINGS_VALIDATION_SCHEMA}
		>
			{formikProps => {
				const { errors, touched, values, setFieldValue } = formikProps;

				return (
					<>
						<div className="row u-margin-bottom">
							<div className="col-xs-12 col-md-6">
								<Field
									as={TextField}
									description="Geef de taxonomie een korte en duidelijke naam. Deze naam verschijnt in de applicatie."
									id="label"
									label="Naam"
									name="label"
									required
									state={getFieldState(touched, errors, 'label')}
								/>
								<ErrorMessage component="p" name="label" />
							</div>
						</div>

						<div className="row u-margin-bottom">
							<div className="col-xs-12">
								<Field
									as={Textarea}
									id="description"
									label="Beschrijving"
									name="description"
								/>
								<small className="u-block u-text-light u-margin-top-xs">
									Geef de taxonomie een duidelijke beschrijving. Deze wordt
									gebruikt in het overzicht.
								</small>
							</div>
						</div>

						<div className="row u-margin-bottom">
							<div className="col-xs-12 col-md-6">
								<Field
									as={Select}
									id="publishStatus"
									label="Status"
									name="publishStatus"
									options={SETTINGS_PUBLISH_STATUS_OPTIONS}
									required
								/>
								<small className="u-block u-text-light u-margin-top-xs">
									Selecteer een status.
								</small>
								<ErrorMessage component="p" name="publishStatus" />
							</div>
						</div>

						<div
							className={classnames(
								'row',
								isUpdate ? 'u-margin-bottom' : 'u-margin-bottom-lg'
							)}
						>
							<div className="col-xs-12">
								<Field
									as={Checkbox}
									id="multiLanguage"
									label="Vertaalbaar"
									name="multiLanguage"
									checked={values.multiLanguage}
									onChange={() => {
										setFieldValue('multiLanguage', !values.multiLanguage);
									}}
								/>
							</div>
						</div>

						{typeof children === 'function'
							? (children as FormikChildrenFn<TaxonomyDetailModel>)(formikProps)
							: children}
					</>
				);
			}}
		</Formik>
	);
};

export default TaxonomySettingsForm;
