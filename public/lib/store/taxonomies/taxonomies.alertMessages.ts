import { AlertMessages } from '../../taxonomy.types';

export const getAlertMessages = (
	name?: string
): AlertMessages<'create' | 'update' | 'fetch' | 'fetchOne' | 'delete'> => ({
	create: {
		success: {
			title: 'Aangemaakt',
			message: `U hebt de taxonomie ${name} succesvol aangemaakt`,
		},
		error: {
			title: 'Aanmaken mislukt',
			message: `Aanmaken van de taxonomie ${name} is mislukt`,
		},
	},
	update: {
		success: {
			title: 'Bewaard',
			message: `U hebt de taxonomie ${name} succesvol gewijzigd`,
		},
		error: {
			title: 'Bewaren mislukt',
			message: `Bewaren van de taxonomie ${name} is mislukt`,
		},
	},
	fetch: {
		error: {
			title: 'Ophalen',
			message: 'Ophalen van taxonomieën is mislukt',
		},
	},
	fetchOne: {
		error: {
			title: 'Ophalen',
			message: 'Ophalen van taxonomie is mislukt',
		},
	},
	delete: {
		success: {
			title: 'Verwijderen',
			message: `U hebt de taxonomie ${name} succesvol verwijderd`,
		},
		error: {
			title: 'Verwijderen',
			message: `Verwijderen van taxonomie ${name} is mislukt`,
		},
	},
});

export const getTermsAlertMessages = (
	name?: string
): AlertMessages<'create' | 'update' | 'fetch' | 'fetchOne' | 'delete'> => ({
	create: {
		success: {
			title: 'Aangemaakt',
			message: `U hebt de Taxonomy term ${name} succesvol aangemaakt`,
		},
		error: {
			title: 'Aanmaken mislukt',
			message: `Aanmaken van de Taxonomy term ${name} is mislukt`,
		},
	},
	update: {
		success: {
			title: 'Bewaard',
			message: `U hebt de Taxonomy term ${name} succesvol gewijzigd`,
		},
		error: {
			title: 'Bewaren mislukt',
			message: `Bewaren van de Taxonomy term ${name} is mislukt`,
		},
	},
	fetch: {
		error: {
			title: 'Ophalen',
			message: 'Ophalen van Taxonomy termen is mislukt',
		},
	},
	fetchOne: {
		error: {
			title: 'Ophalen',
			message: 'Ophalen van Taxonomy term is mislukt',
		},
	},
	delete: {
		success: {
			title: 'Verwijderen',
			message: `U hebt de Taxonomy term ${name} succesvol verwijderd`,
		},
		error: {
			title: 'Verwijderen',
			message: `Verwijderen van Taxonomy term ${name} is mislukt`,
		},
	},
});
