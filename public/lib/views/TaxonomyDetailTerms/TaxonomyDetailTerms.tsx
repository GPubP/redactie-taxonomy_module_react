import { Table } from '@acpaas-ui/react-editorial-components';
import { AlertContainer, DataLoader, useNavigate } from '@redactie/utils';
import React, { FC, ReactElement, useEffect, useMemo, useState } from 'react';

import { useCoreTranslation } from '../../connectors';
import { useActiveTaxonomy, useTaxonomiesUIStates } from '../../hooks';
import { ALERT_CONTAINER_IDS } from '../../taxonomy.const';
import { TaxonomyRouteProps } from '../../taxonomy.types';

import { DETAIL_TERMS_COLUMNS } from './TaxonomyDetailTerms.const';
import { DetailTermTableRow } from './TaxonomyDetailTerms.types';

const TaxonomyDetailTerms: FC<TaxonomyRouteProps> = ({ match }) => {
	const taxonomyId = parseInt(match.params.taxonomyId);

	/**
	 * HOOKS
	 */
	const [t] = useCoreTranslation();
	const [taxonomy] = useActiveTaxonomy(taxonomyId);
	const { navigate } = useNavigate();
	const [, detailState] = useTaxonomiesUIStates();
	const [initialLoading, setInitialLoading] = useState(true);
	const isLoading = useMemo(() => detailState?.isUpdating, [detailState]);
	// Set initial loading
	useEffect(() => {
		if (initialLoading && !isLoading) {
			setInitialLoading(false);
		}
	}, [initialLoading, isLoading]);

	/**
	 * RENDER
	 */
	const renderTermsOverview = (): ReactElement => {
		const customTaxonomyTermRows: DetailTermTableRow[] = (taxonomy?.terms || []).map(term => ({
			taxonomyId,
			id: term.id,
			label: term.label,
			description: term.description,
			navigate,
		}));

		return <Table columns={DETAIL_TERMS_COLUMNS(t)} rows={customTaxonomyTermRows} />;
	};

	return (
		<>
			<AlertContainer
				toastClassName="u-margin-bottom"
				containerId={ALERT_CONTAINER_IDS.detailTerms}
			/>
			<DataLoader loadingState={initialLoading} render={renderTermsOverview} />
		</>
	);
};

export default TaxonomyDetailTerms;
