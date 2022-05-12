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
	ContextHeaderBadge,
	DataLoader,
	FormikOnChangeHandler,
	LeavePrompt,
	useDetectValueChanges,
	useNavigate,
	useOnNextRender,
	useRoutes,
} from '@redactie/utils';
import { FormikProps } from 'formik';
import { omit, pick } from 'ramda';
import React, { FC, ReactElement, useEffect, useMemo, useRef, useState } from 'react';

import { DeleteCard, TermForm, TermFormValues } from '../../components';
import { CORE_TRANSLATIONS, translationsConnector } from '../../connectors';
import { useTaxonomy, useTaxonomyTerm, useTaxonomyTermsUIStates } from '../../hooks';
import { TaxonomyTerm } from '../../services/taxonomyTerms';
import { taxonomiesFacade } from '../../store/taxonomies';
import { ALERT_CONTAINER_IDS, BREADCRUMB_OPTIONS, MODULE_PATHS } from '../../taxonomy.const';
import { PublishStatus } from '../../taxonomy.types';

import {
	INITIAL_TERM_VALUE,
	TERM_DETAIL_ALLOWED_PATHS,
	TERM_VALUE_KEYS,
} from './TaxonomyTermDetail.const';
import { TaxonomyTermRouteProps } from './TaxonomyTermDetail.types';

export const TaxonomyTermDetail: FC<TaxonomyTermRouteProps> = ({ match }) => {
	const taxonomyId = match.params.taxonomyId ? parseInt(match.params.taxonomyId) : undefined;
	const termId = match.params.termId ? parseInt(match.params.termId) : undefined;
	const isUpdate = !!termId;

	/**
	 * HOOKS
	 */
	const [t] = translationsConnector.useCoreTranslation();
	const { generatePath, navigate } = useNavigate();
	const routes = useRoutes();
	const formikRef = useRef<FormikProps<TermFormValues>>();

	const [taxonomy] = useTaxonomy(taxonomyId);
	const [taxonomyTerm] = useTaxonomyTerm(taxonomyId, termId);
	const breadcrumbs = useBreadcrumbs(routes as ModuleRouteConfig[], {
		...BREADCRUMB_OPTIONS(generatePath),
		extraBreadcrumbs: [
			...(BREADCRUMB_OPTIONS(generatePath).extraBreadcrumbs || []),
			{ name: 'Taxonomie', target: generatePath(MODULE_PATHS.overview) },
			{ name: 'Termen', target: generatePath(MODULE_PATHS.detailTerms, { taxonomyId }) },
		],
	});
	const [listState, detailState] = useTaxonomyTermsUIStates(termId);
	const [formValue, setFormValue] = useState<TermFormValues | null>(
		!isUpdate ? INITIAL_TERM_VALUE : null
	);
	const [isInitialLoading, setInitialLoading] = useState(isUpdate);
	const [showModal, setShowModal] = useState(false);
	const isLoading = useMemo(
		() => (isUpdate ? !!detailState?.isUpdating : !!listState?.isCreating),
		[detailState, isUpdate, listState]
	);
	const [hasChanges, resetChangeDetection] = useDetectValueChanges(
		isUpdate ? !isInitialLoading && !isLoading && !!formValue : true,
		formValue
	);
	const [forceNavigateToOverview] = useOnNextRender(() =>
		navigate(MODULE_PATHS.detailTerms, { taxonomyId })
	);

	// Set initial loading
	useEffect(() => {
		if (isUpdate && detailState) {
			setInitialLoading(detailState.isFetching);
		}
	}, [detailState, isUpdate]);

	// Set initial form value
	useEffect(() => {
		if (isUpdate && !isInitialLoading && taxonomyTerm) {
			setFormValue({ ...INITIAL_TERM_VALUE, ...pick(TERM_VALUE_KEYS, taxonomyTerm) });
		}
	}, [isInitialLoading, isUpdate, taxonomyTerm]);

	/**
	 * METHODS
	 */
	const updateTerm = async (updatedTerm: TermFormValues): Promise<void> => {
		if (!taxonomyId) {
			return;
		}
		// Omit keys from form to always ensure the last updated values
		const payload = { ...omit(TERM_VALUE_KEYS, taxonomyTerm), ...updatedTerm } as TaxonomyTerm;

		await taxonomiesFacade
			.updateTaxonomyTerm(taxonomyId, payload, {
				errorAlertContainerId: ALERT_CONTAINER_IDS.termDetail,
				successAlertContainerId: ALERT_CONTAINER_IDS.detailTerms,
			})
			.then(() => {
				resetChangeDetection();
				forceNavigateToOverview();
			});
	};

	const createTerm = async (newTerm: TermFormValues): Promise<void> => {
		if (!taxonomyId) {
			return;
		}

		const newTaxonomyTerm = await taxonomiesFacade.createTaxonomyTerm(
			taxonomyId,
			{
				...newTerm,
				// Should always be published on create
				publishStatus: PublishStatus.Published,
			},
			{
				errorAlertContainerId: ALERT_CONTAINER_IDS.termDetail,
				successAlertContainerId: ALERT_CONTAINER_IDS.detailTerms,
			}
		);

		if (newTaxonomyTerm && newTaxonomyTerm.id) {
			resetChangeDetection();
			forceNavigateToOverview();
		}
	};

	const deleteTerm = async (): Promise<void> => {
		if (!taxonomyId || !taxonomyTerm) {
			return;
		}

		await taxonomiesFacade
			.deleteTaxonomyTerm(taxonomyId, taxonomyTerm, {
				errorAlertContainerId: ALERT_CONTAINER_IDS.termDetail,
				successAlertContainerId: ALERT_CONTAINER_IDS.detailTerms,
			})
			.then(() => navigate(MODULE_PATHS.detailTerms, { taxonomyId }))
			.catch(() => setShowModal(false));
	};

	const onFormSubmit = (values: TermFormValues): void => {
		isUpdate ? updateTerm(values) : createTerm(values);
	};

	const onCancel = (): void => {
		taxonomyId && navigate(MODULE_PATHS.detailTerms, { taxonomyId });
	};

	const headerBadges: ContextHeaderBadge[] = isUpdate
		? [
				{
					name: 'Term',
					type: 'primary',
				},
		  ]
		: [];

	/**
	 * RENDER
	 */
	const pageTitle = isUpdate
		? `${taxonomyTerm?.label ? `'${taxonomyTerm?.label}'` : 'Term'} ${t(
				CORE_TRANSLATIONS.ROUTING_UPDATE
		  )}`
		: `Term ${t(CORE_TRANSLATIONS.ROUTING_CREATE)}`;

	const renderForm = (): ReactElement => (
		<>
			<TermForm
				formikRef={instance => (formikRef.current = instance || undefined)}
				allTerms={taxonomy?.terms || []}
				initialValues={formValue}
				taxonomyTerm={taxonomyTerm}
				onSubmit={onFormSubmit}
			>
				{({ submitForm }) => {
					return (
						<>
							<FormikOnChangeHandler
								onChange={values => setFormValue(values as TermFormValues)}
							/>
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
											{t(CORE_TRANSLATIONS.BUTTON_SAVE)}
										</Button>
									</div>
								</ActionBarContentSection>
							</ActionBar>
							<LeavePrompt
								allowedPaths={TERM_DETAIL_ALLOWED_PATHS}
								when={hasChanges}
								onConfirm={submitForm}
							/>
						</>
					);
				}}
			</TermForm>
			{isUpdate && (
				<DeleteCard
					className="u-margin-bottom-lg"
					description="Opgelet: indien je deze taxonomie term verwijdert kan hij niet meer gebruikt worden in de content types."
					isDeleting={!!detailState?.isDeleting}
					onDelete={deleteTerm}
					setShowModal={setShowModal}
					showModal={showModal}
				/>
			)}
		</>
	);

	return (
		<>
			<ContextHeader title={pageTitle} badges={headerBadges}>
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
