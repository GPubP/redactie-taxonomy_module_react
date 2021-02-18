import { Autocomplete, Select } from '@acpaas-ui/react-components';
import { Cascader } from '@acpaas-ui/react-editorial-components';
import React, { ChangeEvent, FC, useMemo } from 'react';

import { listToTree } from '../../helpers';
import { TaxonomyTerm } from '../../services/taxonomyTerms';
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
	selectionMethod = TaxonomySelectMethods.Dropdown,
}) => {
	const { setValue } = form.getFieldHelpers(field.name);

	/**
	 * Hooks
	 */

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

		const defaultOption: CascaderOption = { label: placeholder, value: null };
		const filteredTerms = hasMultipleLevels
			? listToTree(mappedTermOptions, {
					idKey: 'value',
					parentKey: 'parentTermId',
					childrenKey: 'children',
			  })
			: selectionMethod === TaxonomySelectMethods.Dropdown
			? [defaultOption].concat(mappedTermOptions)
			: mappedTermOptions;

		return [filteredTerms, hasMultipleLevels];
	}, [allTerms, placeholder, selectionMethod]);

	/**
	 * Methods
	 */

	const getPositionInputValue = (terms: TaxonomyTerm[], inputValue: number): string => {
		const activeTerm = terms.find(term => term.id === inputValue);

		return activeTerm?.label || placeholder;
	};

	/**
	 * Render
	 */

	if (!hasChildren) {
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
						options={filteredTermOptions}
						label={label}
						description={description}
						{...field}
						onChange={(e: ChangeEvent<HTMLSelectElement>) => {
							setValue(parseInt(e.target.value));
						}}
					/>
				);
			}
		}
	}

	return (
		<>
			<div className="a-input has-icon-right">
				<label className="a-input__label" htmlFor="text-field">
					{label}
				</label>
				<Cascader
					changeOnSelect
					value={value}
					options={filteredTermOptions}
					onChange={(value: string[]) => setValue(parseInt(value[value.length - 1]))}
				>
					<div className="a-input__wrapper">
						<input
							onChange={() => null}
							placeholder="Kies een positie in de boom"
							value={getPositionInputValue(allTerms, field.value)}
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
			</div>
			<small className="u-block u-text-light u-margin-top-xs">{description}</small>
		</>
	);
};
