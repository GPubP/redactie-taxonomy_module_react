import { Autocomplete, Button, Select } from '@acpaas-ui/react-components';
import { Cascader } from '@acpaas-ui/react-editorial-components';
import classnames from 'classnames/bind';
import { isNil } from 'ramda';
import React, {
	ChangeEvent,
	FC,
	ReactElement,
	useContext,
	useEffect,
	useMemo,
	useState,
} from 'react';

import { formRendererConnector } from '../../connectors';
import { listToTree, sortNestedTerms, sortTerms } from '../../helpers';
import { TermLanguagePropertyPrefix } from '../../taxonomy.types';
import { TaxonomySelectMethods } from '../Fields/TaxonomySelect/TaxonomySelect.types';

import { TERM_SELECT_DEFAULT_PLACEHOLDER } from './TaxonomyTermSelect.const';
import styles from './TaxonomyTermSelect.module.scss';
import {
	CascaderOption,
	TaxonomyTermSelectProps,
	TermSelectOption,
} from './TaxonomyTermSelect.types';

const cx = classnames.bind(styles);

export const TaxonomyTermSelect: FC<TaxonomyTermSelectProps> = ({
	form,
	field,
	label,
	description,
	allTerms,
	placeholder = TERM_SELECT_DEFAULT_PLACEHOLDER,
	placeholderValue = '',
	selectionMethod = TaxonomySelectMethods.Dropdown,
	required = false,
	synced = false,
}) => {
	const { setValue } = form.getFieldHelpers(field.name);
	const FormRendererFieldTitle = formRendererConnector.api.FormRendererFieldTitle;

	/**
	 * Hooks
	 */

	const [cascaderValue, setCascaderValue] = useState<number[]>([]);
	const { activeLanguage } = useContext(formRendererConnector.api.FormContext);
	const [filteredTermOptions, hasChildren] = useMemo(() => {
		const { mappedTermOptions, hasMultipleLevels } = (allTerms || []).reduce(
			(acc, term) => {
				// See if we can find a translation for the current active language
				const label =
					isNil(activeLanguage) || !term.propertyValues?.length
						? term.label
						: term.propertyValues.find(
								propValue =>
									propValue.key ===
									`${TermLanguagePropertyPrefix.Label}${activeLanguage}`
						  )?.value ?? term.label;

				acc.mappedTermOptions.push({
					value: term.id,
					label,
					parentTermId: term.parentTermId,
					children: [],
					position:
						Number(
							term.propertyValues.find(propValue => propValue.key === 'position')
								?.value
						) || 0,
				});

				if (term.id && term.parentTermId && term.id !== term.parentTermId) {
					acc.hasMultipleLevels = true;
				}

				return acc;
			},
			{
				mappedTermOptions: [] as (CascaderOption & { position: number })[],
				hasMultipleLevels: false,
			}
		);

		// Items with no parent will have their own id used as parentTermId
		// By setting the placeholderValue with that id it will show the placeholder as intended
		// (this only applies to the Select component)
		const defaultOption: TermSelectOption = {
			label: placeholder,
			value: placeholderValue,
		};
		const filteredTerms = hasMultipleLevels
			? sortNestedTerms(
					listToTree(mappedTermOptions, {
						idKey: 'value',
						parentKey: 'parentTermId',
						childrenKey: 'children',
					})
			  )
			: selectionMethod === TaxonomySelectMethods.AutoComplete
			? sortTerms(mappedTermOptions)
			: [defaultOption].concat(
					sortTerms(mappedTermOptions).map(option => ({
						label: option.label,
						value: option.value ? option.value : '',
					}))
			  );

		return [filteredTerms, hasMultipleLevels];
	}, [activeLanguage, allTerms, placeholder, placeholderValue, selectionMethod]);

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
					<div>
						<FormRendererFieldTitle
							isRequired={required}
							isSynced={synced}
							className="u-margin-bottom-xs"
						>
							{label}
						</FormRendererFieldTitle>
						<div className={cx('m-taxonomy-term-select')}>
							<Autocomplete
								defaultValue={field.value}
								id={field.name}
								items={filteredTermOptions}
								onSelection={(selectedTermId: number) => setValue(selectedTermId)}
								placeholder={placeholder}
							/>
						</div>
					</div>
				);
			case TaxonomySelectMethods.Dropdown:
			default: {
				return (
					<div>
						<FormRendererFieldTitle
							isRequired={required}
							isSynced={synced}
							className="u-margin-bottom-xs"
						>
							{label}
						</FormRendererFieldTitle>
						<div className={cx('m-taxonomy-term-select')}>
							<Select
								description={description}
								options={filteredTermOptions}
								{...field}
								value={field.value || ''}
								onChange={(e: ChangeEvent<HTMLSelectElement>) => {
									setValue(parseInt(e.target.value));
								}}
							/>
						</div>
					</div>
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
				<formRendererConnector.api.ErrorMessage name={field.name} />
			</div>
		);
	}

	return (
		<div className={`a-input has-icon-right`}>
			<FormRendererFieldTitle
				isRequired={required}
				isSynced={synced}
				className="u-margin-bottom-xs"
			>
				{label}
			</FormRendererFieldTitle>
			<div className={cx('m-taxonomy-term-select')}>
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
								className="fa"
								style={{
									pointerEvents: 'initial',
									cursor: 'pointer',
								}}
							>
								<Button
									icon="close"
									ariaLabel="Close"
									size="small"
									transparent
									style={{
										top: '-2px',
									}}
									onClick={(e: React.SyntheticEvent) => {
										e.preventDefault();
										e.stopPropagation();
										setValue(undefined);
									}}
								/>
							</span>
						) : (
							<span className="fa fa-angle-down" />
						)}
					</div>
				</Cascader>
			</div>
			<small>{description}</small>
			<formRendererConnector.api.ErrorMessage name={field.name} />
		</div>
	);
};
