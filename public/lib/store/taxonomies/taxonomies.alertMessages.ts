import { AlertMessages } from '../../taxonomy.types';

export const getAlertMessages = (
	name?: string
): AlertMessages<'create' | 'update' | 'fetch' | 'fetchOne' | 'delete'> => ({
	create: {
		success: {
			title: 'Aangemaakt',
			message: `U hebt de taxonomy ${name} succesvol aangemaakt`,
		},
		error: {
			title: 'Aanmaken mislukt',
			message: `Aanmaken van de taxonomy ${name} is mislukt`,
		},
	},
	update: {
		success: {
			title: 'Bewaard',
			message: `U hebt de taxonomy ${name} succesvol gewijzigd`,
		},
		error: {
			title: 'Bewaren mislukt',
			message: `Bewaren van de taxonomy ${name} is mislukt`,
		},
	},
	fetch: {
		error: {
			title: 'Ophalen',
			message: 'Ophalen van taxonomies is mislukt',
		},
	},
	fetchOne: {
		error: {
			title: 'Ophalen',
			message: 'Ophalen van taxonomy is mislukt',
		},
	},
	delete: {
		success: {
			title: 'Verwijderen',
			message: `U hebt de taxonomy ${name} succesvol verwijderd`,
		},
		error: {
			title: 'Verwijderen',
			message: `Verwijderen van taxonomy ${name} is mislukt`,
		},
	},
});
