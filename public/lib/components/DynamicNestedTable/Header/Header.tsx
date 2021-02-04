import { Button } from '@acpaas-ui/react-components';
import classnames from 'classnames';
import React, { FC, ReactNode } from 'react';

import { HeaderProps } from './Header.types';

const Header: FC<HeaderProps> = ({
	activeSorting = { key: '', order: 'asc' },
	classList,
	className,
	component,
	disableSorting,
	label,
	onSortClick = () => null,
	value = '',
}) => {
	const renderTableHeader = (): ReactNode => {
		if (component) {
			return component(label);
		}
		if (disableSorting) {
			return label;
		}

		const sortIcon = activeSorting.key === value ? `sort-${activeSorting.order}` : 'sort';
		const newOrder = activeSorting.order === 'asc' ? 'desc' : 'asc';

		return (
			<Button
				className="a-table__header__button"
				iconRight={sortIcon}
				onClick={() => onSortClick(value, newOrder)}
				size="tiny"
				type="transparent"
			>
				{label}
			</Button>
		);
	};

	return <div className={classnames(className, classList)}>{renderTableHeader()}</div>;
};

export default Header;
