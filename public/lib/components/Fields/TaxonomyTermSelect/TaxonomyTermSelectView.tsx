import { ViewFieldProps } from '@redactie/form-renderer-module';
import classnames from 'classnames/bind';
import React, { FC, useEffect, useState } from 'react';

import { TaxonomyTerm, taxonomyTermsApiService } from '../../../services/taxonomyTerms';

import { INITIAL_TAXONOMY_CONFIG } from './TaxonomyTermSelect.const';
import styles from './TaxonomyTermSelect.module.scss';

const cx = classnames.bind(styles);

const TaxonomyTermView: FC<ViewFieldProps> = ({ fieldSchema, value }) => {
	const { config = INITIAL_TAXONOMY_CONFIG } = fieldSchema;
	const { taxonomyConfig } = config;

	const [term, setTerm] = useState<TaxonomyTerm | null>(null);

	// Fetch term
	useEffect(() => {
		if (taxonomyConfig?.taxonomyId && value) {
			taxonomyTermsApiService.getTerm(taxonomyConfig.taxonomyId, value).then(response => {
				if (response?.label) {
					setTerm(response);
				}
			});
		}
	}, [taxonomyConfig, value]);

	return term ? (
		<div className={cx('m-taxonomy-term-select-view', 'm-tag')}>
			<div className="m-tag__label u-text-xlight">{term.label}</div>
		</div>
	) : null;
};

export default TaxonomyTermView;
