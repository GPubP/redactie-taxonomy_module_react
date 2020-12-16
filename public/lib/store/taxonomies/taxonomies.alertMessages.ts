import { AlertMessages } from '../../taxonomy.types';

export const getAlertMessages = (
	name?: string
): AlertMessages<'create' | 'update' | 'fetch' | 'fetchOne' | 'delete'> => ({
	create: {
		success: {
			title: 'Aangemaakt',
			message: `U hebt de content component ${name} succesvol aangemaakt`,
		},
		error: {
			title: 'Aanmaken mislukt',
			message: `Aanmaken van de content component ${name} is mislukt`,
		},
	},
	update: {
		success: {
			title: 'Bewaard',
			message: `U hebt de content component ${name} succesvol gewijzigd`,
		},
		error: {
			title: 'Bewaren mislukt',
			message: `Bewaren van de content component ${name} is mislukt`,
		},
	},
	fetch: {
		error: {
			title: 'Ophalen',
			message: 'Ophalen van content componenten is mislukt',
		},
	},
	fetchOne: {
		error: {
			title: 'Ophalen',
			message: 'Ophalen van content component is mislukt',
		},
	},
	delete: {
		success: {
			title: 'Verwijderen',
			message: `U hebt de content component ${name} succesvol verwijderd`,
		},
		error: {
			title: 'Verwijderen',
			message: `Verwijderen van content component ${name} is mislukt`,
		},
	},
});
