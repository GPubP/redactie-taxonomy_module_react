import { Button } from '@acpaas-ui/react-components';
import { ActionBar, ActionBarContentSection } from '@acpaas-ui/react-editorial-components';
import {
	AlertContainer,
	alertService,
	FormikOnChangeHandler,
	LeavePrompt,
	useDetectValueChangesWorker,
	useNavigate,
} from '@redactie/utils';
import { FormikProps, FormikValues } from 'formik';
import React, { FC, useMemo, useRef, useState } from 'react';

import { DeleteCard, TaxonomySettingsForm } from '../../components';
import { CORE_TRANSLATIONS, translationsConnector } from '../../connectors';
import { useTaxonomiesUIStates } from '../../hooks';
import { taxonomiesFacade, TaxonomyDetailModel } from '../../store/taxonomies';
import { ALERT_CONTAINER_IDS, DETAIL_TAB_MAP, MODULE_PATHS } from '../../taxonomy.const';
import { TaxonomyDetailRouteProps } from '../../taxonomy.types';

const TaxonomyDetailSettings: FC<TaxonomyDetailRouteProps> = ({
	allowedPaths,
	onCancel,
	onSubmit,
	taxonomy,
}) => {
	const isUpdate = !!taxonomy?.id;

	/**
	 * Hooks
	 */
	const [t] = translationsConnector.useCoreTranslation();
	const [listState, detailState] = useTaxonomiesUIStates(taxonomy?.id);

	const formikRef = useRef<FormikProps<FormikValues>>();
	const isLoading = useMemo(
		() => (isUpdate ? !!detailState?.isUpdating : !!listState?.isCreating),
		[detailState, isUpdate, listState]
	);
	const [formValue, setFormValue] = useState<TaxonomyDetailModel | null>(taxonomy || null);
	const [showModal, setShowModal] = useState(false);

	const { navigate } = useNavigate();
	const [hasChanges, resetChangeDetection] = useDetectValueChangesWorker(
		!isLoading && !!taxonomy,
		formValue,
		BFF_MODULE_PUBLIC_PATH
	);

	/**
	 * Methods
	 */
	const renderDangerAlert = ({
		title = 'Foutmelding',
		message = 'Niet alle velden van het formulier zijn correct ingevuld',
	} = {}): void => {
		alertService.danger(
			{ title, message },
			{ containerId: ALERT_CONTAINER_IDS.detailSettings }
		);
	};

	const onFormSubmit = async (value: TaxonomyDetailModel | null): Promise<void> => {
		if (!value) {
			return renderDangerAlert();
		}

		if (!formikRef || !formikRef.current) {
			return renderDangerAlert({
				message: 'Er is iets fout gelopen. Probeer later opnieuw.',
			});
		}

		onSubmit({ ...taxonomy, ...value }, DETAIL_TAB_MAP.settings);
		resetChangeDetection();
	};

	const deleteTaxonomy = async (): Promise<void> => {
		await taxonomiesFacade
			.deleteTaxonomy(taxonomy, {
				successAlertContainerId: ALERT_CONTAINER_IDS.overview,
				errorAlertContainerId: ALERT_CONTAINER_IDS.detailSettings,
			})
			.then(() => navigate(MODULE_PATHS.overview))
			.catch(() => setShowModal(false));
	};

	/**
	 * Render
	 */
	return (
		<>
			<AlertContainer
				toastClassName="u-margin-bottom"
				containerId={ALERT_CONTAINER_IDS.detailSettings}
			/>
			<TaxonomySettingsForm
				formikRef={instance => (formikRef.current = instance || undefined)}
				taxonomy={taxonomy}
				isUpdate={isUpdate}
				onSubmit={onFormSubmit}
			>
				{({ submitForm }) => {
					return (
						<>
							<FormikOnChangeHandler
								onChange={values => {
									setFormValue(values as TaxonomyDetailModel);
								}}
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
											{isUpdate
												? t(CORE_TRANSLATIONS.BUTTON_SAVE)
												: t(CORE_TRANSLATIONS['BUTTON_SAVE-NEXT'])}
										</Button>
									</div>
								</ActionBarContentSection>
							</ActionBar>
							<LeavePrompt
								allowedPaths={allowedPaths}
								when={hasChanges}
								shouldBlockNavigationOnConfirm
								onConfirm={submitForm}
							/>
						</>
					);
				}}
			</TaxonomySettingsForm>
			{isUpdate && (
				<DeleteCard
					className="u-margin-bottom-lg"
					description="Opgelet: indien je deze taxonomie verwijdert kan hij niet meer gebruikt worden in de content types."
					isDeleting={!!detailState?.isDeleting}
					onDelete={deleteTaxonomy}
					showModal={showModal}
					setShowModal={setShowModal}
				/>
			)}
		</>
	);
};

export default TaxonomyDetailSettings;
