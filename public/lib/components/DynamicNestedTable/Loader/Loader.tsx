import { Spinner } from '@acpaas-ui/react-components';
import React, { FC } from 'react';

import { LoaderProps } from './Loader.types';

const Loader: FC<LoaderProps> = ({ loadDataMessage }) => {
	return (
		<div className="a-table--loading">
			<Spinner className="u-margin-right-xs" style={{ display: 'inline' }} />
			<span>{loadDataMessage}</span>
		</div>
	);
};

export default Loader;
