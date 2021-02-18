import { Button, Card, CardBody, CardDescription } from '@acpaas-ui/react-components';
import { DeletePrompt } from '@redactie/utils';
import React, { FC } from 'react';

import { CORE_TRANSLATIONS, useCoreTranslation } from '../../connectors';

import { DeleteCardProps } from './DeleteCard.types';

const DeleteCard: FC<DeleteCardProps> = ({
	className,
	description,
	isDeleting,
	onDelete,
	setShowModal,
	showModal,
	title,
}) => {
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
				<DeletePrompt
					isDeleting={isDeleting}
					onCancel={closeModal}
					onConfirm={onDelete}
					show={showModal}
				/>
			</CardBody>
		</Card>
	);
};

export default DeleteCard;
