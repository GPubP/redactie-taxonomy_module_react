import { Button } from '@acpaas-ui/react-components';
import {
	Container,
	ContextHeader,
	ContextHeaderActionsSection,
	ContextHeaderTopSection,
} from '@acpaas-ui/react-editorial-components';
import { ModuleRouteConfig, useBreadcrumbs } from '@redactie/redactie-core';
import { DataLoader, useNavigate, useRoutes } from '@redactie/utils';
import React, { FC, ReactElement } from 'react';

import { CORE_TRANSLATIONS, useCoreTranslation } from '../../connectors';
import { BREADCRUMB_OPTIONS, MODULE_PATHS } from '../../taxonomy.const';
import { TaxonomyRouteProps } from '../../taxonomy.types';

const TaxonomyOverview: FC<TaxonomyRouteProps> = () => {
	const [t] = useCoreTranslation();
	const { generatePath, navigate } = useNavigate();
	const routes = useRoutes();
	const breadcrumbs = useBreadcrumbs(
		routes as ModuleRouteConfig[],
		BREADCRUMB_OPTIONS(generatePath)
	);

	const renderOverview = (): ReactElement | null => {
		return <div>Taxonomy overview</div>;
	};

	return (
		<>
			<ContextHeader title="Taxonomie">
				<ContextHeaderTopSection>{breadcrumbs}</ContextHeaderTopSection>
				<ContextHeaderActionsSection>
					<Button iconLeft="plus" onClick={() => navigate(MODULE_PATHS.create)}>
						{t(CORE_TRANSLATIONS['BUTTON_CREATE-NEW'])}
					</Button>
				</ContextHeaderActionsSection>
			</ContextHeader>
			<Container>
				<DataLoader loadingState={true} render={renderOverview} />
			</Container>
		</>
	);
};

export default TaxonomyOverview;
