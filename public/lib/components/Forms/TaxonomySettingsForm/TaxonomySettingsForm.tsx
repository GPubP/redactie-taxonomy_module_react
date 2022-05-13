import { Card, CardBody, Checkbox, Select, Textarea, TextField } from '@acpaas-ui/react-components';
import { ErrorMessage, FormikChildrenFn } from '@redactie/utils';
import classnames from 'classnames';
import { Field, Formik, isFunction } from 'formik';
import React, { FC } from 'react';

import { translationsConnector } from '../../../connectors';
import { getFieldState } from '../../../helpers';
import { MODULE_TRANSLATIONS } from '../../../i18next';
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
	const [tModule] = translationsConnector.useModuleTranslation();

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
									description={tModule(
										MODULE_TRANSLATIONS.SETTINGS_FORM_LABEL_FIELD_DESCRIPTION
									)}
									id="label"
									label={tModule(
										MODULE_TRANSLATIONS.SETTINGS_FORM_LABEL_FIELD_LABEL
									)}
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
									label={tModule(
										MODULE_TRANSLATIONS.SETTINGS_FORM_DESCRIPTION_FIELD_LABEL
									)}
									name="description"
								/>
								<small className="u-block u-text-light u-margin-top-xs">
									{tModule(
										MODULE_TRANSLATIONS.SETTINGS_FORM_DESCRIPTION_FIELD_DESCRIPTION
									)}
								</small>
							</div>
						</div>

						<div className="row u-margin-bottom">
							<div className="col-xs-12 col-md-6">
								<Field
									as={Select}
									id="publishStatus"
									label={tModule(
										MODULE_TRANSLATIONS.SETTINGS_FORM_STATUS_FIELD_LABEL
									)}
									name="publishStatus"
									options={SETTINGS_PUBLISH_STATUS_OPTIONS}
									required
								/>
								<small className="u-block u-text-light u-margin-top-xs">
									{tModule(
										MODULE_TRANSLATIONS.SETTINGS_FORM_STATUS_FIELD_DESCRIPTION
									)}
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
								<Card>
									<CardBody>
										<h6>
											{tModule(
												MODULE_TRANSLATIONS.SETTINGS_MULTI_LANGUAGE_CARD_TITLE
											)}
										</h6>
										<p className="u-margin-top u-margin-bottom">
											{tModule(
												MODULE_TRANSLATIONS.SETTINGS_MULTI_LANGUAGE_CARD_DESCRIPTION
											)}
										</p>
										<Field
											as={Checkbox}
											checked={values.multiLanguage}
											id="multiLanguage"
											label={tModule(
												MODULE_TRANSLATIONS.SETTINGS_MULTI_LANGUAGE_CARD_CHECKBOX_LABEL
											)}
											name="multiLanguage"
											onChange={() => {
												setFieldValue(
													'multiLanguage',
													!values.multiLanguage
												);
											}}
										/>
									</CardBody>
								</Card>
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
