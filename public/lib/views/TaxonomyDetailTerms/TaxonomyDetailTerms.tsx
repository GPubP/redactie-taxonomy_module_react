import { AlertContainer } from '@redactie/utils';
import React, { FC } from 'react';

import { ALERT_CONTAINER_IDS } from '../../taxonomy.const';

const TaxonomyDetailTerms: FC = () => {
	return (
		<>
			<AlertContainer
				toastClassName="u-margin-bottom"
				containerId={ALERT_CONTAINER_IDS.detailTerms}
			/>
			<div>Taxonomy terms overview</div>
		</>
	);
};

export default TaxonomyDetailTerms;
