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
	AlertContainer,
	DataLoader,
	LeavePrompt,
	useDetectValueChangesWorker,
	useNavigate,
	useRoutes,
} from '@redactie/utils';
import { FormikProps, FormikValues } from 'formik';
import React, { FC, ReactElement, useMemo, useRef, useState } from 'react';

import { TermForm } from '../../components';
import { CORE_TRANSLATIONS, useCoreTranslation } from '../../connectors';
import { useActiveTaxonomy, useTaxonomyTermsUIStates } from '../../hooks';
import useActiveTaxonomyTerm from '../../hooks/useActiveTaxonomyTerm/useActiveTaxonomyTerm';
import { TaxonomyTerm } from '../../services/taxonomyTerms';
import { taxonomiesFacade, TaxonomyTermDetailModel } from '../../store/taxonomies';
import { ALERT_CONTAINER_IDS, BREADCRUMB_OPTIONS, MODULE_PATHS } from '../../taxonomy.const';

import { TERM_DETAIL_ALLOWED_PATHS } from './TaxonomyTermDetail.const';
import { TaxonomyTermRouteProps } from './TaxonomyTermDetail.types';

export const TaxonomyTermDetail: FC<TaxonomyTermRouteProps> = ({ match }) => {
	const taxonomyId = match.params.taxonomyId ? parseInt(match.params.taxonomyId) : undefined;
	const termId = match.params.termId ? parseInt(match.params.termId) : undefined;
	const isUpdate = !!termId;

	/**
	 * HOOKS
	 */
	const [t] = useCoreTranslation();
	const { generatePath, navigate } = useNavigate();
	const routes = useRoutes();
	const formikRef = useRef<FormikProps<FormikValues>>();

	const [taxonomy] = useActiveTaxonomy(taxonomyId);
	const [taxonomyTerm] = useActiveTaxonomyTerm(taxonomyId, termId);
	const breadcrumbs = useBreadcrumbs(routes as ModuleRouteConfig[], {
		...BREADCRUMB_OPTIONS(generatePath),
		extraBreadcrumbs: [
			...(BREADCRUMB_OPTIONS(generatePath).extraBreadcrumbs || []),
			{ name: 'Taxonomie', target: generatePath(MODULE_PATHS.overview) },
			{ name: 'Termen', target: generatePath(MODULE_PATHS.detailTerms, { taxonomyId }) },
		],
	});
	const [listState, detailState] = useTaxonomyTermsUIStates();
	const [formValue, setFormValue] = useState<TaxonomyTermDetailModel | null>(null);
	const isLoading = useMemo(
		() => (isUpdate ? !!detailState?.isUpdating : !!listState?.isCreating),
		[detailState, isUpdate, listState]
	);
	const isInitialLoading = useMemo(() => {
		if (!isUpdate || (detailState && detailState.isFetching)) {
			return false;
		}

		return true;
	}, [detailState, isUpdate]);
	const [hasChanges, resetChangeDetection] = useDetectValueChangesWorker(
		!isInitialLoading && !isLoading,
		formValue,
		BFF_MODULE_PUBLIC_PATH
	);

	/**
	 * METHODS
	 */

	const updateTerm = async (taxonomyTerm: TaxonomyTerm): Promise<void> => {
		taxonomyId &&
			(await taxonomiesFacade.updateTaxonomyTerm(taxonomyId, taxonomyTerm, {
				alertContainerId: ALERT_CONTAINER_IDS.termDetail,
			}));
	};

	const createTerm = async (taxonomyTerm: TaxonomyTerm): Promise<void> => {
		if (!taxonomyId) {
			return;
		}

		const newTaxonomyTerm = await taxonomiesFacade.createTaxonomyTerm(
			taxonomyId,
			{
				...taxonomyTerm,
				// Should always be published on create
				publishStatus: 'PUBLISHED',
			},
			{
				errorAlertContainerId: ALERT_CONTAINER_IDS.termDetail,
				successAlertContainerId: ALERT_CONTAINER_IDS.termDetail,
			}
		);

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
		taxonomyId && navigate(MODULE_PATHS.detailTerms, { taxonomyId });
	};

	/**
	 * RENDER
	 */

	const renderForm = (): ReactElement => (
		<TermForm
			formikRef={instance => (formikRef.current = instance || undefined)}
			onSubmit={onFormSubmit}
			allTerms={taxonomy?.terms || []}
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
							allowedPaths={TERM_DETAIL_ALLOWED_PATHS}
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
				<AlertContainer
					toastClassName="u-margin-bottom"
					containerId={ALERT_CONTAINER_IDS.termDetail}
				/>
				<DataLoader loadingState={isInitialLoading} render={renderForm} />
			</Container>
		</>
	);
};
