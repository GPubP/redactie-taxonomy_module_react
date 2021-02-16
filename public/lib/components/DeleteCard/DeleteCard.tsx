import { Button, Card, CardBody, CardDescription } from '@acpaas-ui/react-components';
import {
	ControlledModal,
	ControlledModalBody,
	ControlledModalFooter,
	ControlledModalHeader,
} from '@acpaas-ui/react-editorial-components';
import React, { FC, useState } from 'react';

import { CORE_TRANSLATIONS, useCoreTranslation } from '../../connectors';

import { DeleteCardProps } from './DeleteCard.types';

const DeleteCard: FC<DeleteCardProps> = ({
	className,
	description,
	isDeleting,
	onDelete,
	title,
}) => {
	const [showModal, setShowModal] = useState(false);
	const [t] = useCoreTranslation();

	const closeModal = (): void => setShowModal(false);

	return (
		<Card className={className}>
			<CardBody>
				<h6 className="u-margin-bottom-xs">{title || t(CORE_TRANSLATIONS.REMOVE_TITLE)}</h6>
				<CardDescription>{description}</CardDescription>
				<Button
					className="u-margin-top"
					iconLeft="trash"
					onClick={() => setShowModal(true)}
					type="secondary"
				>
					{t(CORE_TRANSLATIONS.BUTTON_REMOVE)}
				</Button>
				<ControlledModal onClose={closeModal} show={showModal} size="large">
					<ControlledModalHeader>
						<h5>
							Verwijderen?
							{/* TODO: replace with {t(CORE_TRANSLATIONS['MODAL_TITLE-REMOVE'])} */}
						</h5>
					</ControlledModalHeader>
					<ControlledModalBody>
						Ben je zeker dat je dit item wil verwijderen? Dit kan niet ongedaan gemaakt
						worden.
					</ControlledModalBody>
					<ControlledModalFooter>
						<div className="u-flex-item u-flex u-flex-justify-end">
							<Button onClick={closeModal} negative>
								{t(CORE_TRANSLATIONS.MODAL_CANCEL)}
							</Button>
							<Button
								iconLeft={isDeleting ? 'circle-o-notch fa-spin' : 'trash'}
								disabled={isDeleting}
								onClick={onDelete}
								type="danger"
							>
								Ja, verwijder
								{/* TODO: replace with {t(CORE_TRANSLATIONS['MODAL_CONFIRM-REMOVE'])} */}
							</Button>
						</div>
					</ControlledModalFooter>
				</ControlledModal>
			</CardBody>
		</Card>
	);
};

export default DeleteCard;
