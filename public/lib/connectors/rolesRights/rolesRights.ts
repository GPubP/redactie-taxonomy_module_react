import Core from '@redactie/redactie-core';
import { RolesRightsModuleAPI } from '@redactie/roles-rights-module';

class RolesRightsConnector {
	public static apiName = 'roles-rights-module';
	public api: RolesRightsModuleAPI;
	public securityRights = {
		create: 'taxonomies_create',
		update: 'taxonomies_update',
		read: 'taxonomies_read',
	};

	public get guards(): RolesRightsModuleAPI['guards'] {
		return this.api.guards;
	}

	public get canShowns(): RolesRightsModuleAPI['canShowns'] {
		return this.api.canShowns;
	}

	public get components(): RolesRightsModuleAPI['components'] {
		return this.api.components;
	}

	constructor(api?: RolesRightsModuleAPI) {
		if (!api) {
			throw new Error(
				`Taxonomy module:
				Dependencies not found: ${RolesRightsConnector.apiName}`
			);
		}
		this.api = api;
	}
}

const rolesRightsConnector = new RolesRightsConnector(
	Core.modules.getModuleAPI<RolesRightsModuleAPI>(RolesRightsConnector.apiName)
);

export default rolesRightsConnector;
