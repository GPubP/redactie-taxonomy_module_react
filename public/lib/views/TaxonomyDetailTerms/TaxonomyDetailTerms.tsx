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
import React, { FC, ReactElement, useEffect, useMemo, useRef, useState } from 'react';

import { DynamicNestedTable, INDENT_SIZE, XYCoord } from '../../components';
import { CORE_TRANSLATIONS, useCoreTranslation } from '../../connectors';
import { listToTree, sortNestedTerms } from '../../helpers';
import { useTaxonomiesUIStates, useTaxonomy } from '../../hooks';
import { TaxonomyTerm } from '../../services/taxonomyTerms';
import { taxonomiesFacade } from '../../store/taxonomies';
import { ALERT_CONTAINER_IDS, MODULE_PATHS } from '../../taxonomy.const';
import { NestedTaxonomyTerm, TaxonomyRouteProps } from '../../taxonomy.types';

import {
	DETAIL_TERMS_ALLOWED_PATHS,
	DETAIL_TERMS_COLUMNS,
	INITIAL_HAS_MOVED,
	PARENT_TERM_ID_LENS,
	POSITION_LENS,
} from './TaxonomyDetailTerms.const';
import {
	DetailTermTableRow,
	DndItem,
	HasMovedRef,
	MoveDirection,
} from './TaxonomyDetailTerms.types';
import {
	canMoveDown,
	canMoveLeft,
	canMoveRight,
	canMoveUp,
	findNestedTerm,
	recursiveFlatten,
	termIsTopLevel,
} from './TaxonomyDetailTerms.utils';

const TaxonomyDetailTerms: FC<TaxonomyRouteProps> = ({ match }) => {
	const taxonomyId = parseInt(match.params.taxonomyId);

	/**
	 * HOOKS
	 */

	const [t] = useCoreTranslation();
	const [taxonomy] = useTaxonomy(taxonomyId);
	const [, detailState] = useTaxonomiesUIStates(taxonomyId);
	const [terms, setTerms] = useState<TaxonomyTerm[]>([]);
	const hasMoved = useRef<HasMovedRef>(INITIAL_HAS_MOVED);

	const { generatePath, navigate } = useNavigate();
	const [initialLoading, setInitialLoading] = useState(true);
	const isLoading = useMemo(() => detailState?.isUpdating, [detailState]);
	const termsTree = useMemo(() => {
		return terms.length
			? sortNestedTerms(listToTree(terms, { parentKey: 'parentTermId' }))
			: [];
	}, [terms]);

	const [hasChanges, resetChangeDetection] = useDetectValueChangesWorker(
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
		if (taxonomy?.terms?.length) {
			// Set initial position on terms
			const termsWithPosition = recursiveFlatten(
				listToTree(taxonomy.terms, {
					addPosition: true,
					parentKey: 'parentTermId',
				})
			).map(term => omit(['children'], term));

			setTerms(termsWithPosition);
		}
	}, [taxonomy]);

	/**
	 * Methods
	 */

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
			// Update on next tick to avoid issues with react-dnd caused by internal id's being
			// overwritten when dragging horizontally
			setTimeout(() => setTerms(updatedTerms), 0);
		}
	};

	const onDragRow = (
		source: DndItem,
		target: DndItem,
		boundingRect: DOMRect | null,
		clientOffset: XYCoord | null,
		offsetDiff?: XYCoord | null
	): void => {
		const sourceTerm = terms.find(term => term.id === source.id);
		const targetTerm = terms.find(term => term.id === target.id);

		if (!sourceTerm || !targetTerm) {
			return;
		}
		// Don't perform drag action when item is the only one in top level
		if (termIsTopLevel(sourceTerm) && termsTree.length === 1) {
			return;
		}

		// Handle horizontal movement
		if (sourceTerm.id === targetTerm.id) {
			if (!offsetDiff || !boundingRect) {
				return;
			}

			if (hasMoved.current?.id && sourceTerm.id !== hasMoved.current?.id) {
				hasMoved.current = INITIAL_HAS_MOVED;
			}

			const { zeroPoint, leftXThreshold, rightXThreshold } = hasMoved.current;
			const movingLeft = offsetDiff.x < zeroPoint && offsetDiff.x < leftXThreshold;
			const movingRight = offsetDiff.x > zeroPoint && offsetDiff.x > rightXThreshold;

			if (movingLeft && canMoveLeft(sourceTerm)) {
				const list = findNestedTerm(termsTree, sourceTerm.parentTermId)?.children || [];
				const sourceIndex = list.findIndex(term => term.id === source.id);
				// Only allow last item in level to move left to avoid jumping from current index
				const isLastTermInTree = sourceIndex !== -1 && sourceIndex === list.length - 1;
				if (isLastTermInTree) {
					// Keep ref of previous to check whether we can increment going a level higher
					hasMoved.current = {
						id: source.id,
						leftXThreshold: leftXThreshold - INDENT_SIZE,
						rightXThreshold: rightXThreshold - INDENT_SIZE,
						zeroPoint: offsetDiff.x - INDENT_SIZE,
					};
					onMoveRow(source.id, MoveDirection.Left);
				}
			} else if (movingRight && canMoveRight(termsTree, sourceTerm)) {
				// Keep ref of previous to check whether we can increment going a level deeper
				hasMoved.current = {
					id: source.id,
					leftXThreshold: leftXThreshold + INDENT_SIZE,
					rightXThreshold: rightXThreshold + INDENT_SIZE,
					zeroPoint: offsetDiff.x + INDENT_SIZE,
				};
				onMoveRow(source.id, MoveDirection.Right);
			}
			return;
		}

		// Check if target is child
		if (targetTerm.parentTermId === sourceTerm.id) {
			return;
		}

		// Handle vertical movement
		const targetIsTopLevel = termIsTopLevel(targetTerm);
		const movedInSameTree =
			(termIsTopLevel(sourceTerm) && targetIsTopLevel) ||
			(sourceTerm.parentTermId === targetTerm.parentTermId &&
				targetTerm.parentTermId !== targetTerm.id &&
				sourceTerm.parentTermId !== sourceTerm.id);
		// Update parentTermId
		const newParentTermId = targetIsTopLevel ? source.id : targetTerm.parentTermId;
		const updatedTerm = set(PARENT_TERM_ID_LENS, newParentTermId, sourceTerm);
		// Reposition old list
		const oldList = movedInSameTree
			? []
			: findNestedTerm(termsTree, sourceTerm.parentTermId)?.children || [];
		const reorderedOldList = repositionTerms(oldList.filter(old => old.id !== sourceTerm.id));
		// Reposition new list
		// targetId is only needed when target is not top level
		const targetId = movedInSameTree ? sourceTerm.parentTermId : targetTerm.parentTermId;
		const targetList = targetIsTopLevel
			? termsTree
			: findNestedTerm(termsTree, targetId)?.children || [];
		const newList = movedInSameTree
			? move(updatedTerm.position, targetTerm.position, targetList)
			: insert(targetTerm.position, updatedTerm, targetList);
		const reorderedNewList = repositionTerms(newList);
		// Update terms
		const updatedTerms = updateTerms(reorderedOldList.concat(reorderedNewList));
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
			taxonomiesFacade
				.updateTaxonomyTerms(payload, {
					alertContainerId: ALERT_CONTAINER_IDS.detailTerms,
				})
				.then(() => resetChangeDetection());
		}
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
				canMoveUp: canMoveUp(termsTree, term),
				canMoveDown: canMoveDown(termsTree, term),
				canMoveRight: canMoveRight(termsTree, term),
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
				className="u-margin-bottom"
				tableClassName="a-table--fixed--xs"
				columns={DETAIL_TERMS_COLUMNS(t, onMoveRow)}
				dataKey="id"
				draggable
				fixed
				moveRow={onDragRow}
				rows={termRows}
				noDataMessage={t(CORE_TRANSLATIONS['TABLE_NO-RESULT'])}
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
