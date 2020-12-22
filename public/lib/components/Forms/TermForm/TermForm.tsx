import { Textarea, TextField } from '@acpaas-ui/react-components';
import { ErrorMessage } from '@redactie/utils';
import { Field, Formik, isFunction } from 'formik';
import React, { FC } from 'react';

import { getFieldState } from '../../../helpers';
import { FormikChildrenFn } from '../../../taxonomy.types';
import { TaxonomyTermSelect } from '../../TaxonomyTermSelect';

import { TERM_FORM_VALIDATION_SCHEMA } from './TermForm.const';
import { TaxonomyTermFormProps } from './TermForm.types';

export const TermForm: FC<TaxonomyTermFormProps> = ({
	children,
	formikRef,
	isUpdate = false,
	allTerms,
	taxonomyTerm,
	onSubmit,
}) => {
	return (
		<Formik
			innerRef={instance => isFunction(formikRef) && formikRef(instance)}
			initialValues={taxonomyTerm || {}}
			onSubmit={onSubmit}
			enableReinitialize={true}
			validationSchema={TERM_FORM_VALIDATION_SCHEMA}
		>
			{formikProps => {
				const { errors, touched } = formikProps;

				return (
					<>
						<div className="row">
							<div className="col-xs-12 col-md-8 row middle-xs">
								<div className="col-xs-12 col-md-8">
									<Field
										as={TextField}
										description="Geef de taxonomie term een korte en duidelijke naam. Deze naam verschijnt in de applicatie."
										id="label"
										label="Naam"
										name="label"
										required
										state={getFieldState(touched, errors, 'label')}
									/>
									<ErrorMessage name="label" />
								</div>
							</div>
						</div>

						<div className="row">
							<div className="col-xs-12 u-margin-top">
								<Field
									as={Textarea}
									id="description"
									label="Beschrijving"
									name="description"
								/>
								<small className="u-block u-text-light u-margin-top-xs">
									Geef de taxonomie term een duidelijke beschrijving voor in het
									overzicht.
								</small>
								<ErrorMessage name="description" />
							</div>
						</div>

						<div className="row u-margin-bottom-lg">
							<div className="col-xs-12 col-md-8 row middle-xs u-margin-top">
								<div className="col-xs-12 col-md-8">
									<Field
										id="parentTermId"
										label="Bovenliggende term"
										name="parentTermId"
										component={TaxonomyTermSelect}
										allTerms={allTerms}
										description="Bepaal de bovenliggende term (de 'parent') van deze term"
									/>
									<ErrorMessage name="parentTermId" />
								</div>
							</div>
						</div>

						{isUpdate && (
							<div className="row u-margin-bottom-lg">{/* TODO: add delete */}</div>
						)}

						{typeof children === 'function'
							? (children as FormikChildrenFn)(formikProps)
							: children}
					</>
				);
			}}
		</Formik>
	);
};
