import { Autocomplete, Select } from '@acpaas-ui/react-components';
import { Cascader } from '@acpaas-ui/react-editorial-components';
import React, { ChangeEvent, FC, ReactElement, useEffect, useMemo, useState } from 'react';

import { listToTree } from '../../helpers';
import { SelectOption } from '../../taxonomy.types';
import { TaxonomySelectMethods } from '../Fields/TaxonomySelect/TaxonomySelect.types';

import { TERM_SELECT_DEFAULT_PLACEHOLDER } from './TaxonomyTermSelect.const';
import { CascaderOption, TaxonomyTermSelectProps } from './TaxonomyTermSelect.types';

export const TaxonomyTermSelect: FC<TaxonomyTermSelectProps> = ({
	form,
	field,
	label,
	description,
	allTerms,
	placeholder = TERM_SELECT_DEFAULT_PLACEHOLDER,
	placeholderValue,
	selectionMethod = TaxonomySelectMethods.Dropdown,
}) => {
	const { setValue } = form.getFieldHelpers(field.name);

	/**
	 * Hooks
	 */

	const [cascaderValue, setCascaderValue] = useState<number[]>([]);
	const [filteredTermOptions, hasChildren] = useMemo(() => {
		const { mappedTermOptions, hasMultipleLevels } = (allTerms || []).reduce(
			(acc, term) => {
				acc.mappedTermOptions.push({
					value: term.id,
					label: term.label,
					parentTermId: term.parentTermId,
					children: [],
				});

				if (term.id && term.parentTermId && term.id !== term.parentTermId) {
					acc.hasMultipleLevels = true;
				}

				return acc;
			},
			{
				mappedTermOptions: [] as CascaderOption[],
				hasMultipleLevels: false,
			}
		);

		const defaultOption: SelectOption = { label: placeholder, value: String(placeholderValue) };
		const filteredTerms = hasMultipleLevels
			? listToTree(mappedTermOptions, {
					idKey: 'value',
					parentKey: 'parentTermId',
					childrenKey: 'children',
			  })
			: selectionMethod === TaxonomySelectMethods.Dropdown
			? [defaultOption].concat(
					mappedTermOptions.map(option => ({
						label: option.label,
						value: option.value ? String(option.value) : '',
					}))
			  )
			: mappedTermOptions;

		return [filteredTerms, hasMultipleLevels];
	}, [allTerms, placeholder, placeholderValue, selectionMethod]);

	// Set initial cascader value
	useEffect(() => {
		if ((selectionMethod === TaxonomySelectMethods.Cascader || hasChildren) && field.value) {
			const getCascaderValue = (ids: number[]): number[] => {
				const parentId = ids[ids.length - 1];
				const activeTerm = allTerms.find(term => term.id === parentId);
				// Return when parenTerm is already included
				if (!activeTerm || ids.includes(activeTerm.parentTermId)) {
					return ids;
				}
				// Go further up the tree
				return getCascaderValue(ids.concat(activeTerm.parentTermId));
			};
			const initialValue = getCascaderValue([field.value]).reverse();

			setCascaderValue(initialValue);
		}
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	/**
	 * Methods
	 */

	const getPositionInputValue = (): string => {
		const activeTerm = allTerms.find(term => term.id === field.value);

		return activeTerm?.label || placeholder;
	};

	const onCascaderChange = (value: number[]): void => {
		setCascaderValue(value);
		setValue(value[value.length - 1]);
	};

	const renderField = (): ReactElement => {
		switch (selectionMethod) {
			case TaxonomySelectMethods.AutoComplete:
				return (
					<Autocomplete
						defaultValue={field.value}
						id={field.name}
						items={filteredTermOptions}
						label={label}
						onSelection={(selectedTermId: number) => setValue(selectedTermId)}
						placeholder={placeholder}
					/>
				);
			case TaxonomySelectMethods.Dropdown:
			default: {
				return (
					<Select
						description={description}
						label={label}
						options={filteredTermOptions}
						{...field}
						value={field.value || ''}
						onChange={(e: ChangeEvent<HTMLSelectElement>) => {
							setValue(parseInt(e.target.value));
						}}
					/>
				);
			}
		}
	};

	/**
	 * Render
	 */

	if (!hasChildren) {
		return (
			<div className="a-input">
				{renderField()}
				<small>{description}</small>
			</div>
		);
	}

	return (
		<div className="a-input has-icon-right">
			<label className="a-input__label" htmlFor="text-field">
				{label}
			</label>
			<Cascader
				changeOnSelect
				value={cascaderValue}
				options={filteredTermOptions}
				onChange={onCascaderChange}
			>
				<div className="a-input__wrapper">
					<input
						onChange={() => null}
						placeholder="Kies een positie in de boom"
						value={getPositionInputValue()}
					/>

					{field.value ? (
						<span
							style={{
								pointerEvents: 'initial',
								cursor: 'pointer',
							}}
							onClick={(e: React.SyntheticEvent) => {
								e.preventDefault();
								e.stopPropagation();
								setValue(undefined);
							}}
							className="fa fa-times-circle"
						/>
					) : (
						<span className="fa fa-angle-down" />
					)}
				</div>
			</Cascader>
			<small>{description}</small>
		</div>
	);
};
