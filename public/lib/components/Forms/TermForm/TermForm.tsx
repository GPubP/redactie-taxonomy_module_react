import { Textarea, TextField } from '@acpaas-ui/react-components';
import { ErrorMessage, FormikChildrenFn } from '@redactie/utils';
import { Field, Formik, isFunction } from 'formik';
import React, { FC, useMemo } from 'react';

import { getFieldState } from '../../../helpers';
import { TaxonomyTermSelect } from '../../TaxonomyTermSelect';

import { TERM_FORM_VALIDATION_SCHEMA } from './TermForm.const';
import { TaxonomyTermFormProps, TermFormValues } from './TermForm.types';

export const TermForm: FC<TaxonomyTermFormProps> = ({
	allTerms,
	children,
	formikRef,
	initialValues,
	onSubmit,
	taxonomyTerm,
}) => {
	/**
	 * Hooks
	 */

	// Don't show same term in list for parent terms
	const filteredTerms = useMemo(() => {
		return taxonomyTerm?.id ? allTerms.filter(term => term.id !== taxonomyTerm?.id) : allTerms;
	}, [allTerms, taxonomyTerm]);

	const termValidationSchema = useMemo(() => {
		return TERM_FORM_VALIDATION_SCHEMA(filteredTerms.map(term => term.label));
	}, [filteredTerms]);

	/**
	 * Render
	 */

	return initialValues ? (
		<Formik
			innerRef={instance => isFunction(formikRef) && formikRef(instance)}
			initialValues={initialValues}
			onSubmit={onSubmit}
			validationSchema={termValidationSchema}
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
									Geef de taxonomie term een duidelijke beschrijving. Deze wordt
									gebruikt in het overzicht.
								</small>
								<ErrorMessage name="description" />
							</div>
						</div>

						<div className="row u-margin-bottom-lg">
							<div className="col-xs-12 col-md-8 row middle-xs u-margin-top">
								<div className="col-xs-12 col-md-8">
									<Field
										id="parentTermId"
										name="parentTermId"
										label="Bovenliggende term"
										component={TaxonomyTermSelect}
										allTerms={filteredTerms}
										description="Bepaal de bovenliggende term (de 'parent') van deze term."
										placeholderValue={taxonomyTerm?.id}
									/>
									<ErrorMessage name="parentTermId" />
								</div>
							</div>
						</div>

						{typeof children === 'function'
							? (children as FormikChildrenFn<TermFormValues>)(formikProps)
							: children}
					</>
				);
			}}
		</Formik>
	) : null;
};
