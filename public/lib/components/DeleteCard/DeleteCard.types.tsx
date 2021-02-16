export interface DeleteCardProps {
	className?: string;
	description?: string;
	isDeleting: boolean;
	onDelete: (setShowModal: (show: boolean) => void) => void;
	title?: string;
}
