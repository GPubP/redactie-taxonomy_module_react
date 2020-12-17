import { Button } from '@acpaas-ui/react-components';
import {
	ActionBar,
	ActionBarContentSection,
	Container,
	ContextHeader,
	ContextHeaderTopSection,
} from '@acpaas-ui/react-editorial-components';
import { ModuleRouteConfig, useBreadcrumbs } from '@redactie/redactie-core';
import {
	DataLoader,
	LeavePrompt,
	useDetectValueChangesWorker,
	useNavigate,
	useRoutes,
} from '@redactie/utils';
import { FormikProps, FormikValues } from 'formik';
import React, { FC, ReactElement, useEffect, useMemo, useRef, useState } from 'react';

import { TermForm } from '../../components';
import { CORE_TRANSLATIONS, useCoreTranslation } from '../../connectors';
import { useTaxonomyTermsUIStates } from '../../hooks';
import useActiveTaxonomyTerm from '../../hooks/useActiveTaxonomyTerm/useActiveTaxonomyTerm';
import { useTaxonomyTerms } from '../../hooks/useTaxonomyTerms/useTaxonomyTerms';
import { TaxonomyTerm } from '../../services/taxonomyTerms';
import { TaxonomyTermDetailModel, taxonomyTermsFacade } from '../../store/taxonomyTerms';
import { BREADCRUMB_OPTIONS, MODULE_PATHS } from '../../taxonomy.const';

import { TaxonomyTermRouteProps } from './TaxonomyTermDetail.types';

export const TaxonomyTermDetail: FC<TaxonomyTermRouteProps> = ({ match }) => {
	const taxonomyId = match.params.taxonomyUuid ? parseInt(match.params.taxonomyUuid) : null;
	const termId = match.params.termId ? parseInt(match.params.termId) : null;
	const isUpdate = !!termId;

	/**
	 * HOOKS
	 */
	const [t] = useCoreTranslation();
	const { generatePath, navigate } = useNavigate();
	const routes = useRoutes();
	const formikRef = useRef<FormikProps<FormikValues>>();
	const breadcrumbs = useBreadcrumbs(routes as ModuleRouteConfig[], {
		...BREADCRUMB_OPTIONS(generatePath),
		extraBreadcrumbs: [
			...(BREADCRUMB_OPTIONS(generatePath).extraBreadcrumbs || []),
			{ name: 'Content componenten', target: generatePath(MODULE_PATHS.overview) },
		],
	});
	const taxonomyTerms = useTaxonomyTerms();
	const [taxonomyTerm] = useActiveTaxonomyTerm(taxonomyId, termId);
	const [listState, detailState] = useTaxonomyTermsUIStates();
	const isLoading = useMemo(
		() => (isUpdate ? !!detailState?.isUpdating : !!listState?.isCreating),
		[detailState, isUpdate, listState]
	);
	const [formValue, setFormValue] = useState<TaxonomyTermDetailModel | null>(null);
	const [hasChanges, resetChangeDetection] = useDetectValueChangesWorker(
		!isLoading,
		formValue,
		BFF_MODULE_PUBLIC_PATH
	);

	useEffect(() => {
		taxonomyId && taxonomyTermsFacade.getTaxonomyTerms(taxonomyId);
	}, [taxonomyId]);

	/**
	 * METHODS
	 */
	const updateTerm = async (taxonomyTerm: TaxonomyTerm): Promise<void> => {
		taxonomyId && (await taxonomyTermsFacade.updateTaxonomyTerm(taxonomyId, taxonomyTerm));
	};
	const createTerm = async (taxonomyTerm: TaxonomyTerm): Promise<void> => {
		if (!taxonomyId) {
			return;
		}

		const newTaxonomyTerm = await taxonomyTermsFacade.createTaxonomyTerm(taxonomyId, {
			...taxonomyTerm,
			// Should always be published on create
			publishStatus: 'PUBLISHED',
		});

		if ((newTaxonomyTerm as TaxonomyTerm)?.id) {
			resetChangeDetection();
			navigate(MODULE_PATHS.terms.detail, {
				taxonomyId,
				termId: (newTaxonomyTerm as TaxonomyTerm)?.id,
			});
		}
	};
	const onFormSubmit = (values: TaxonomyTerm): void => {
		isUpdate ? updateTerm(values) : createTerm(values);
	};
	const onCancel = (): void => {
		taxonomyId && navigate(MODULE_PATHS.detailTerms, { taxonomyUuid: taxonomyId });
	};

	/**
	 * RENDER
	 */
	console.log(taxonomyTerm);
	const renderForm = (): ReactElement => (
		<TermForm
			formikRef={instance => (formikRef.current = instance || undefined)}
			onSubmit={onFormSubmit}
			allTerms={taxonomyTerms}
			taxonomyTerm={taxonomyTerm}
		>
			{({ submitForm, values }) => {
				setFormValue(values);

				return (
					<>
						<ActionBar className="o-action-bar--fixed" isOpen>
							<ActionBarContentSection>
								<div className="u-wrapper u-text-right">
									<Button onClick={onCancel} negative>
										{isUpdate
											? t(CORE_TRANSLATIONS.BUTTON_CANCEL)
											: t(CORE_TRANSLATIONS.BUTTON_BACK)}
									</Button>
									<Button
										iconLeft={isLoading ? 'circle-o-notch fa-spin' : null}
										disabled={isLoading || !hasChanges}
										className="u-margin-left-xs"
										onClick={submitForm}
										type="success"
									>
										{isUpdate
											? t(CORE_TRANSLATIONS.BUTTON_SAVE)
											: t(CORE_TRANSLATIONS['BUTTON_SAVE-NEXT'])}
									</Button>
								</div>
							</ActionBarContentSection>
						</ActionBar>
						<LeavePrompt
							allowedPaths={[MODULE_PATHS.terms.detail]}
							when={hasChanges}
							shouldBlockNavigationOnConfirm
							onConfirm={submitForm}
						/>
					</>
				);
			}}
		</TermForm>
	);

	return (
		<>
			<ContextHeader title={isUpdate ? `${taxonomyTerm?.label} bewerken` : 'Term aanmaken'}>
				<ContextHeaderTopSection>{breadcrumbs}</ContextHeaderTopSection>
			</ContextHeader>
			<Container>
				<DataLoader loadingState={isLoading} render={renderForm} />
			</Container>
		</>
	);
};
