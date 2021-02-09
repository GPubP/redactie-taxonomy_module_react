import { Button } from '@acpaas-ui/react-components';
import { ActionBar, ActionBarContentSection } from '@acpaas-ui/react-editorial-components';
import {
	AlertContainer,
	DataLoader,
	LeavePrompt,
	useDetectValueChangesWorker,
	useNavigate,
} from '@redactie/utils';
import { insert, move, omit, pipe, set } from 'ramda';
import React, { FC, ReactElement, useEffect, useMemo, useState } from 'react';

import { DynamicNestedTable } from '../../components';
import { CORE_TRANSLATIONS, useCoreTranslation } from '../../connectors';
import { listToTree, sortNestedTerms } from '../../helpers';
import { useActiveTaxonomy, useTaxonomiesUIStates } from '../../hooks';
import { TaxonomyTerm } from '../../services/taxonomyTerms';
import { taxonomiesFacade } from '../../store/taxonomies';
import { ALERT_CONTAINER_IDS, MODULE_PATHS } from '../../taxonomy.const';
import { NestedTaxonomyTerm, TaxonomyRouteProps } from '../../taxonomy.types';

import {
	DETAIL_TERMS_ALLOWED_PATHS,
	DETAIL_TERMS_COLUMNS,
	PARENT_TERM_ID_LENS,
	POSITION_LENS,
} from './TaxonomyDetailTerms.const';
import { DetailTermTableRow, DndItem, MoveDirection } from './TaxonomyDetailTerms.types';

const TaxonomyDetailTerms: FC<TaxonomyRouteProps> = ({ match }) => {
	const taxonomyId = parseInt(match.params.taxonomyId);

	/**
	 * HOOKS
	 */

	const [t] = useCoreTranslation();
	const [taxonomy] = useActiveTaxonomy(taxonomyId);
	const [, detailState] = useTaxonomiesUIStates();
	const [terms, setTerms] = useState<TaxonomyTerm[]>([]);

	const { generatePath, navigate } = useNavigate();
	const [initialLoading, setInitialLoading] = useState(true);
	const isLoading = useMemo(() => detailState?.isUpdating, [detailState]);
	const termsTree = useMemo(() => {
		return terms.length
			? sortNestedTerms(
					listToTree(terms, {
						parentKey: 'parentTermId',
						skipTrees: [],
					})
			  )
			: [];
	}, [terms]);

	const [hasChanges] = useDetectValueChangesWorker(
		!isLoading && terms.length > 0,
		terms,
		BFF_MODULE_PUBLIC_PATH
	);

	// Set initial loading
	useEffect(() => {
		if (initialLoading && !isLoading) {
			setInitialLoading(false);
		}
	}, [initialLoading, isLoading]);

	// Set working copy for taxonomy terms
	useEffect(() => {
		if (taxonomy?.terms.length) {
			// Set initial position on terms
			const recursiveFlatten = (tree: NestedTaxonomyTerm[]): TaxonomyTerm[] => {
				const nestedLevels = tree
					.map(nested => recursiveFlatten(nested.children || []))
					.flat();
				return tree.concat(nestedLevels);
			};
			const termsWithPosition = recursiveFlatten(
				listToTree(taxonomy.terms, {
					addPosition: true,
					parentKey: 'parentTermId',
					skipTrees: [],
				})
			).map(term => omit(['children'], term));

			setTerms(termsWithPosition);
		}
	}, [taxonomy]);

	/**
	 * Methods
	 */

	const findNestedTerm = (
		treeArray: NestedTaxonomyTerm[] | undefined,
		termId: number
	): NestedTaxonomyTerm | undefined => {
		if (!treeArray?.length) {
			return;
		}

		return (
			treeArray.find(tree => tree.id === termId) ||
			findNestedTerm(
				treeArray.flatMap(tree => tree.children || []),
				termId
			)
		);
	};

	const moveTerms = (
		from: NestedTaxonomyTerm,
		to: NestedTaxonomyTerm | undefined
	): TaxonomyTerm[] => {
		return terms.map(term => {
			if (term.id === from.id) {
				return { ...term, position: from.position };
			}
			if (term.id === to?.id) {
				return { ...term, position: to.position };
			}
			return term;
		});
	};

	const repositionTerms = (nestedTerms: NestedTaxonomyTerm[]): TaxonomyTerm[] => {
		return nestedTerms.map((nested, position) => ({
			...nested,
			position,
		}));
	};

	const updateTerms = (movedTerms: NestedTaxonomyTerm[]): TaxonomyTerm[] => {
		return terms.map(term => {
			const termToUpdate = movedTerms.find(moved => moved.id === term.id);
			if (termToUpdate) {
				return omit(['children'], termToUpdate);
			}
			return omit(['children'], term);
		});
	};

	const termIsTopLevel = (term: NestedTaxonomyTerm): boolean =>
		!term.parentTermId || term.parentTermId === term.id;

	const onCancel = (): void => {
		navigate(MODULE_PATHS.overview);
	};

	const onMoveRow = (termId: number, direction: MoveDirection): void => {
		const sourceIndex = terms.findIndex(term => term.id === termId);

		if (sourceIndex === -1) {
			return;
		}

		const source = terms[sourceIndex];
		const parent = findNestedTerm(termsTree, source.parentTermId || termId);

		if (!parent) {
			return;
		}

		let updatedTerms: TaxonomyTerm[] = [];

		switch (direction) {
			case MoveDirection.Up:
			case MoveDirection.Down: {
				const updatedPosition = direction === MoveDirection.Up ? -1 : 1;
				const list = termIsTopLevel(source) ? termsTree : parent.children || [];

				if (list.length) {
					const fromIndex = list.findIndex(child => child.id === termId);
					const toIndex = fromIndex + updatedPosition;
					const updatedFrom = set(POSITION_LENS, toIndex, source);
					const to = list.find(child => child.position === toIndex);
					const updatedTo = set(POSITION_LENS, fromIndex, to);
					updatedTerms = moveTerms(updatedFrom, updatedTo);
				}
				break;
			}
			case MoveDirection.Left: {
				const oldParentTerm = source.parentTermId;
				const newParentTerm = termIsTopLevel(parent) ? termId : parent.parentTermId;
				const updatedTerm = set(PARENT_TERM_ID_LENS, newParentTerm, source);
				// Reposition old list
				const oldList = repositionTerms(
					(parent.children || []).filter(child => child.id !== termId)
				);
				// Reposition new list
				const newList =
					newParentTerm === termId
						? termsTree
						: findNestedTerm(termsTree, newParentTerm)?.children || [];
				// Always place below previous parent
				const newPosition = newList.findIndex(term => term.id === oldParentTerm) + 1;
				// Insert updated term in higher level
				const reorderedNewList = pipe(
					insert(newPosition, updatedTerm),
					repositionTerms
				)(newList);
				updatedTerms = updateTerms(oldList.concat(reorderedNewList));
				break;
			}
			case MoveDirection.Right: {
				const list = termIsTopLevel(source) ? termsTree : parent.children || [];
				const termIndex = list.findIndex(child => child.id === termId);
				// Get previous item in the list
				const prevIndex = termIndex - 1;
				const prevTerm = list[prevIndex];
				// Set new parentTermId
				const updatedTerm = set(PARENT_TERM_ID_LENS, prevTerm.id, source);
				// Reposition old list
				const oldList = repositionTerms(list.filter(child => child.id !== termId));
				// Reposition new list
				const newList = prevTerm.children || [];
				const reorderedNewList = pipe(
					insert(newList.length, updatedTerm),
					repositionTerms
				)(newList);
				updatedTerms = updateTerms(oldList.concat(reorderedNewList));
				break;
			}
		}
		// Don't cause any unnecessary renders
		if (updatedTerms.length) {
			setTerms(updatedTerms);
		}
	};


	const onDragRow = (source: DndItem, target: DndItem): void => {
		let updatedTerms: TaxonomyTerm[] = [];

		if (targetIsTopLevel) {
			const updatedTerm = set(PARENT_TERM_ID_LENS, source.id, sourceTerm);
			// Reposition old list
			const oldList = movedInSameTree
				? []
				: findNestedTerm(termsTree, sourceTerm.parentTermId)?.children || [];
			const reorderedOldList = repositionTerms(
				oldList.filter(old => old.id !== sourceTerm.id)
			);
			// Reposition new list
			const targetList = termsTree;
			const newList = movedInSameTree
				? move(sourceTerm.position, targetTerm.position, targetList)
				: insert(targetTerm.position, updatedTerm, targetList);
			const reorderedNewList = repositionTerms(newList);
			updatedTerms = updateTerms(reorderedOldList.concat(reorderedNewList));
		} else {
			const updatedTerm = set(PARENT_TERM_ID_LENS, targetTerm.parentTermId, sourceTerm);
			// Reposition old list
			const oldList = movedInSameTree
				? []
				: findNestedTerm(termsTree, sourceTerm.parentTermId)?.children || [];
			const reorderedOldList = repositionTerms(
				oldList.filter(old => old.id !== sourceTerm.id)
			);
			// Reposition new list
			const targetId = movedInSameTree ? sourceTerm.parentTermId : targetTerm.parentTermId;
			const targetList = findNestedTerm(termsTree, targetId)?.children || [];

			const newList = movedInSameTree
				? move(sourceTerm.position, targetTerm.position, targetList)
				: insert(targetTerm.position, updatedTerm, targetList);
			const reorderedNewList = repositionTerms(newList);
			updatedTerms = updateTerms(reorderedOldList.concat(reorderedNewList));
		}
		// Don't cause any unnecessary renders
		if (updatedTerms.length) {
			setTerms(updatedTerms);
		}
	};

	const onTermsSave = (): void => {
		if (taxonomy) {
			const payload = {
				id: taxonomyId,
				label: taxonomy.label,
				// TODO: allow position once available from backend
				body: terms.map(term => omit(['position'], term)),
			};
			taxonomiesFacade.updateTaxonomyTerms(payload, {
				alertContainerId: ALERT_CONTAINER_IDS.detailTerms,
			});
		}
	};

	const canMoveLeft = (term: TaxonomyTerm): boolean => {
		return !termIsTopLevel(term);
	};
	const canMoveUp = (term: TaxonomyTerm): boolean => {
		if (termIsTopLevel(term)) {
			const termIndex = termsTree.findIndex(tree => tree.id === term.id);
			return termIndex > 0;
		}
		const parent = findNestedTerm(termsTree, term.parentTermId);
		if (parent?.children?.length) {
			const termIndex = parent.children.findIndex(child => child.id === term.id);
			return termIndex > 0;
		}
		return false;
	};
	const canMoveDown = (term: TaxonomyTerm): boolean => {
		if (termIsTopLevel(term)) {
			const termIndex = termsTree.findIndex(tree => tree.id === term.id);
			return termIndex < termsTree.length - 1;
		}
		const parent = findNestedTerm(termsTree, term.parentTermId);
		if (parent?.children?.length) {
			const termIndex = parent.children.findIndex(child => child.id === term.id);
			return termIndex < parent.children.length - 1;
		}
		return false;
	};
	const canMoveRight = (term: TaxonomyTerm): boolean => {
		if (termIsTopLevel(term)) {
			const termIndex = termsTree.findIndex(tree => tree.id === term.id);
			return termIndex > 0;
		}
		const parent = findNestedTerm(termsTree, term.parentTermId);
		if (!parent?.children) {
			return false;
		}
		const termIndex = parent.children.findIndex(child => child.id === term.id);
		return termIndex < 1
			? false
			: parent.children.length > 1 ||
					parent.children.some(child => child.children?.length || 0 > 1);
	};

	const parseTermRows = (terms: NestedTaxonomyTerm[] = []): DetailTermTableRow[] => {
		return terms.map(term => {
			const pathParams = [
				MODULE_PATHS.terms.detail,
				{ taxonomyId, termId: term.id },
			] as const;

			return {
				taxonomyId,
				id: term.id,
				label: term.label,
				description: term.description,
				canMoveLeft: canMoveLeft(term),
				canMoveUp: canMoveUp(term),
				canMoveDown: canMoveDown(term),
				canMoveRight: canMoveRight(term),
				navigate: () => navigate(...pathParams),
				path: generatePath(...pathParams),
				publishStatus: term.publishStatus,
				rows: parseTermRows(term.children),
			};
		});
	};

	/**
	 * RENDER
	 */

	const renderTermsOverview = (): ReactElement => {
		const termRows = parseTermRows(termsTree);

		return (
			<DynamicNestedTable
				columns={DETAIL_TERMS_COLUMNS(t, onMoveRow) as any}
				dataKey="id"
				draggable
				fixed
				moveRow={onDragRow}
				rows={termRows}
				tableClassName="a-table--fixed--xs"
			/>
		);
	};

	return (
		<>
			<AlertContainer
				toastClassName="u-margin-bottom"
				containerId={ALERT_CONTAINER_IDS.detailTerms}
			/>
			<DataLoader loadingState={initialLoading} render={renderTermsOverview} />

			<ActionBar className="o-action-bar--fixed" isOpen>
				<ActionBarContentSection>
					<div className="u-wrapper row end-xs">
						<Button onClick={onCancel} negative>
							{t(CORE_TRANSLATIONS.BUTTON_CANCEL)}
						</Button>
						<Button
							iconLeft={isLoading ? 'circle-o-notch fa-spin' : null}
							disabled={isLoading || !hasChanges}
							className="u-margin-left-xs"
							onClick={onTermsSave}
							type="success"
						>
							{t(CORE_TRANSLATIONS.BUTTON_SAVE)}
						</Button>
					</div>
				</ActionBarContentSection>
			</ActionBar>

			<LeavePrompt
				allowedPaths={DETAIL_TERMS_ALLOWED_PATHS}
				shouldBlockNavigationOnConfirm
				when={hasChanges}
				onConfirm={onTermsSave}
			/>
		</>
	);
};

export default TaxonomyDetailTerms;
