export interface DeleteCardProps {
	className?: string;
	description?: string;
	isDeleting: boolean;
	onDelete: () => void;
	title?: string;
}
