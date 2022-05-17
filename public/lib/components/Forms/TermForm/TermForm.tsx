import { Textarea, TextField } from '@acpaas-ui/react-components';
import { LanguageHeaderContext } from '@acpaas-ui/react-editorial-components';
import {
	ErrorMessage,
	FormikChildrenFn,
	FormikMultilanguageField,
	FormikOnChangeHandler,
	handleMultilanguageFormErrors,
} from '@redactie/utils';
import { Field, Formik, FormikErrors, FormikTouched, FormikValues, isFunction } from 'formik';
import { path } from 'ramda';
import React, { FC, useContext, useMemo } from 'react';

import { getFieldState } from '../../../helpers';
import { LanguageHeaderContextType } from '../../../taxonomy.types';
import { TaxonomyTermSelect } from '../../TaxonomyTermSelect';

import { TERM_FORM_LABEL_FIELD_PROPS, TERM_FORM_VALIDATION_SCHEMA } from './TermForm.const';
import { TaxonomyTermFormProps, TermFormValues } from './TermForm.types';

export const TermForm: FC<TaxonomyTermFormProps> = ({
	allTerms,
	children,
	className,
	formikRef,
	initialValues,
	languages,
	multiLanguage,
	onSubmit,
	taxonomyTerm,
}) => {
	/**
	 * Hooks
	 */

	const languageHeaderContext = useContext<LanguageHeaderContextType>(LanguageHeaderContext);
	const activeLanguage = languageHeaderContext?.activeLanguage ?? null;
	const setErrors = languageHeaderContext?.setErrors ?? (() => null);

	// Don't show same term in list for parent terms
	const filteredTerms = useMemo(() => {
		return taxonomyTerm?.id ? allTerms.filter(term => term.id !== taxonomyTerm?.id) : allTerms;
	}, [allTerms, taxonomyTerm]);

	const termValidationSchema = useMemo(() => {
		return TERM_FORM_VALIDATION_SCHEMA(
			filteredTerms.map(term => term.label),
			languages,
			multiLanguage
		);
	}, [filteredTerms, languages, multiLanguage]);

	/**
	 * Methods
	 */

	const getMultiLanguageFieldState = (
		touched: FormikTouched<TermFormValues>,
		errors: FormikErrors<TermFormValues>
	): string | null => {
		if (!activeLanguage) {
			return null;
		}
		const valuePath = ['propertyValues', activeLanguage.key];

		return !!path(valuePath, touched) && !!path(valuePath, errors) ? 'error' : null;
	};

	const onFormError = (values: FormikValues, errors: FormikErrors<TermFormValues>): void => {
		if (multiLanguage) {
			setErrors(
				handleMultilanguageFormErrors(errors, values, errors => {
					return Object.keys(errors).reduce(
						(acc, lang) => ({
							...acc,
							[lang]: errors[lang],
						}),
						{}
					);
				})
			);
		}
	};

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
					<div className={className}>
						<FormikOnChangeHandler
							onChange={() => null}
							onError={(values, errors) => onFormError(values, errors)}
						/>

						<div className="row">
							{multiLanguage ? (
								<div className="col-xs-12">
									<FormikMultilanguageField
										{...TERM_FORM_LABEL_FIELD_PROPS}
										asComponent={TextField}
										className="col-md-6 u-no-padding"
										multiLang={multiLanguage}
										name="propertyValues"
										required
										state={getMultiLanguageFieldState(touched, errors)}
									/>
								</div>
							) : (
								<div className="col-xs-12 col-md-6">
									<Field
										{...TERM_FORM_LABEL_FIELD_PROPS}
										as={TextField}
										id="label"
										name="label"
										required
										state={getFieldState(touched, errors, 'label')}
									/>
									<ErrorMessage name="label" />
								</div>
							)}
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
							<div className="col-xs-12 col-md-6 u-margin-top">
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

						{typeof children === 'function'
							? (children as FormikChildrenFn<TermFormValues>)(formikProps)
							: children}
					</div>
				);
			}}
		</Formik>
	) : null;
};
