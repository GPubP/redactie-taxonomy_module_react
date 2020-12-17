import { PaginatorPlugin } from '@datorama/akita';
import { Observable } from 'rxjs';

import { showAlert } from '../../helpers';
import {
	CreateTaxonomyTermPayload,
	TaxonomyTerm,
	taxonomyTermsApiService,
	TaxonomyTermsApiService,
	UpdateTaxonomyTermPayload,
} from '../../services/taxonomyTerms';

import {
	TaxonomyTermDetailModel,
	TaxonomyTermDetailUIModel,
	TaxonomyTermsDetailQuery,
	taxonomyTermsDetailQuery,
	taxonomyTermsDetailStore,
	TaxonomyTermsDetailStore,
} from './detail';
import {
	taxonomyTermListQuery,
	TaxonomyTermListQuery,
	TaxonomyTermsListState,
	taxonomyTermsListStore,
	TaxonomyTermsListStore,
} from './list';
import { taxonomyTermsListPaginator } from './list/taxonomyTerms-list.paginator';
import { getAlertMessages } from './taxonomyTerms.alertMessages';
import { TAXONOMY_TERMS_ALERT_CONTAINER_IDS } from './taxonomyTerms.const';
import {
	CreateTaxonomyTermPayloadOptions,
	GetTaxonomyTermPayloadOptions,
	GetTaxonomyTermsPayloadOptions,
	TaxonomyTermUIModel,
	UpdateTaxonomyTermPayloadOptions,
} from './taxonomyTerms.types';

export class TaxonomyTermsFacade {
	constructor(
		protected listStore: TaxonomyTermsListStore,
		protected listQuery: TaxonomyTermListQuery,
		public listPaginator: PaginatorPlugin<TaxonomyTermsListState>,
		protected detailStore: TaxonomyTermsDetailStore,
		protected detailQuery: TaxonomyTermsDetailQuery,
		protected service: TaxonomyTermsApiService
	) {}

	// LIST STATES
	public readonly taxonomyTerms$ = this.listQuery.taxonomyTerms$;
	public readonly listError$ = this.listQuery.error$;
	public readonly isFetching$ = this.listQuery.isFetching$;
	public setIsFetching(isFetching = false): void {
		this.listStore.setIsFetching(isFetching);
	}
	public selectUIState(): Observable<TaxonomyTermUIModel> {
		return this.listQuery.selectUIState();
	}
	public getIsFetching(): boolean {
		return this.listQuery.getIsFetching();
	}

	// LIST FUNCTIONS
	public getTaxonomyTerms(taxonomyId: number, options?: GetTaxonomyTermsPayloadOptions): void {
		const defaultOptions: GetTaxonomyTermsPayloadOptions = {
			alertContainerId: TAXONOMY_TERMS_ALERT_CONTAINER_IDS.fetch,
		};
		const serviceOptions = {
			...defaultOptions,
			...options,
		};
		const { isFetching } = this.listQuery.getValue();

		if (isFetching) {
			return;
		}

		const alertMessages = getAlertMessages();
		this.listStore.setIsFetching(true);

		this.service
			.getTerms(taxonomyId)
			.then(response => {
				if (Array.isArray(response)) {
					this.listStore.set(response);
					this.listStore.update({
						error: false,
						isFetching: false,
					});

					// Set terms in detail store so it does not need to be fetched again
					this.detailStore.add(response);
				}
			})
			.catch(error => {
				showAlert(serviceOptions.alertContainerId, 'error', alertMessages.fetch.error);
				this.listStore.update({
					isFetching: false,
					error,
				});
			});
	}

	// DETAIL STATES
	public readonly isCreating$ = this.detailQuery.isCreating$;
	public readonly activeTaxonomyTerm$ = this.detailQuery.selectActive<
		TaxonomyTermDetailModel
	>() as Observable<TaxonomyTermDetailModel>;
	public readonly activeTaxonomyTermUI$ = this.detailQuery.ui.selectActive<
		TaxonomyTermDetailUIModel
	>() as Observable<TaxonomyTermDetailUIModel>;

	// DETAIL FUNCTIONS
	public selectTaxonomyTermUIState(termId: number): Observable<TaxonomyTermDetailUIModel> {
		return this.detailQuery.ui.selectEntity(termId);
	}

	public setActiveTaxonomyTerm(termId: number): void {
		this.detailStore.setActive(termId);
		this.detailStore.ui.setActive(termId);
	}

	public removeActiveTaxonomyTerm(): void {
		this.detailStore.setActive(null);
		this.detailStore.ui.setActive(null);
	}

	public hasActiveTaxonomyTerm(termId: number): boolean {
		return this.detailQuery.hasActive(termId);
	}

	public hasTaxonomyTerm(termId: number): boolean {
		return this.detailQuery.hasEntity(termId);
	}

	public createTaxonomyTerm(
		taxonomyId: number,
		payload: CreateTaxonomyTermPayload,
		options: CreateTaxonomyTermPayloadOptions = {
			successAlertContainerId: TAXONOMY_TERMS_ALERT_CONTAINER_IDS.create,
			errorAlertContainerId: TAXONOMY_TERMS_ALERT_CONTAINER_IDS.create,
		}
	): Promise<TaxonomyTerm | void> {
		this.detailStore.setIsCreating(true);
		const alertMessages = getAlertMessages(payload.label);

		return this.service
			.createTerm(taxonomyId, payload)
			.then(taxonomyTerm => {
				this.detailStore.update({
					isCreating: false,
					error: null,
				});
				this.detailStore.upsert(taxonomyTerm.id, taxonomyTerm);
				this.listStore.update(taxonomyTerm.id, taxonomyTerm);

				// Timeout because the alert is visible on the edit page
				// and not on the create page
				setTimeout(() => {
					showAlert(
						options.successAlertContainerId,
						'success',
						alertMessages.create.success
					);
				}, 300);

				return taxonomyTerm;
			})
			.catch(error => {
				showAlert(options.errorAlertContainerId, 'error', alertMessages.create.error);
				this.detailStore.update({
					isCreating: false,
					error,
				});
			});
	}

	public updateTaxonomyTerm(
		taxonomyId: number,
		payload: UpdateTaxonomyTermPayload,
		options: UpdateTaxonomyTermPayloadOptions = {
			alertContainerId: TAXONOMY_TERMS_ALERT_CONTAINER_IDS.create,
		}
	): Promise<TaxonomyTerm | void> {
		this.detailStore.setIsUpdatingEntity(true, payload.id);
		const alertMessages = getAlertMessages(payload.label);

		return this.service
			.updateTerm(taxonomyId, payload)
			.then(taxonomyTerm => {
				this.detailStore.ui.update(payload.id, {
					isUpdating: false,
					error: null,
				});
				this.detailStore.upsert(taxonomyTerm.id, taxonomyTerm);
				this.listStore.update(taxonomyTerm.id, taxonomyTerm);

				showAlert(options.alertContainerId, 'success', alertMessages.update.success);
				return taxonomyTerm;
			})
			.then(error => {
				showAlert(options.alertContainerId, 'error', alertMessages.update.error);
				this.detailStore.ui.update(payload.id, {
					isUpdating: false,
					error,
				});
			});
	}

	public getTaxonomyTerm(
		taxonomyId: number,
		termId: number,
		options?: GetTaxonomyTermPayloadOptions
	): Promise<void> {
		const defaultOptions = {
			alertContainerId: TAXONOMY_TERMS_ALERT_CONTAINER_IDS.fetchOne,
			force: false,
		};
		const serviceOptions = {
			...defaultOptions,
			...options,
		};
		if (this.detailQuery.hasEntity(termId) && !serviceOptions.force) {
			return Promise.resolve();
		}
		const alertMessages = getAlertMessages();
		this.detailStore.setIsFetchingEntity(true, termId);
		return this.service
			.getTerm(taxonomyId, termId)
			.then(response => {
				this.detailStore.upsert(response.id, response);
				this.detailStore.ui.upsert(response.id, { error: null, isFetching: false });
			})
			.catch(error => {
				showAlert(serviceOptions.alertContainerId, 'error', alertMessages.fetchOne.error);
				this.detailStore.ui.upsert(termId, {
					error,
					isFetching: false,
				});
			});
	}
}

export const taxonomyTermsFacade = new TaxonomyTermsFacade(
	taxonomyTermsListStore,
	taxonomyTermListQuery,
	taxonomyTermsListPaginator,
	taxonomyTermsDetailStore,
	taxonomyTermsDetailQuery,
	taxonomyTermsApiService
);
