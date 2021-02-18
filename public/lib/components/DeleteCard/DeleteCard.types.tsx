export interface DeleteCardProps {
	className?: string;
	description?: string;
	isDeleting: boolean;
	onDelete: () => void;
	showModal: boolean;
	setShowModal: (show: boolean) => void;
	title?: string;
}
