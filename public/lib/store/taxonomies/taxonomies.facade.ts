import { PaginationResponse, PaginatorPlugin } from '@datorama/akita';
import { SearchParams } from '@redactie/utils';
import { from, Observable } from 'rxjs';

import { showAlert } from '../../helpers';
import {
	CreateTaxonomyPayload,
	TaxonomiesApiService,
	taxonomiesApiService,
	TaxonomyDetailResponse,
	UpdateTaxonomyPayload,
} from '../../services/taxonomies';

import {
	TaxonomiesDetailQuery,
	taxonomiesDetailQuery,
	TaxonomiesDetailStore,
	taxonomiesDetailStore,
	TaxonomyDetailModel,
	TaxonomyDetailUIModel,
} from './detail';
import {
	taxonomiesListPaginator,
	TaxonomiesListQuery,
	taxonomiesListQuery,
	TaxonomiesListState,
	TaxonomiesListStore,
	taxonomiesListStore,
	TaxonomyListModel,
} from './list';
import { getAlertMessages } from './taxonomies.alertMessages';
import { TAXONOMIES_ALERT_CONTAINER_IDS } from './taxonomies.const';
import {
	CreateTaxonomyPayloadOptions,
	GetTaxonomiesPaginatedPayloadOptions,
	GetTaxonomiesPayloadOptions,
	GetTaxonomyPayloadOptions,
	TaxonomyUIModel,
	UpdateTaxonomyPayloadOptions,
} from './taxonomies.types';

export class TaxonomiesFacade {
	constructor(
		protected listStore: TaxonomiesListStore,
		protected listQuery: TaxonomiesListQuery,
		public listPaginator: PaginatorPlugin<TaxonomiesListState>,
		protected detailStore: TaxonomiesDetailStore,
		protected detailQuery: TaxonomiesDetailQuery,
		protected service: TaxonomiesApiService
	) {}

	// LIST STATES
	public readonly taxonomies$ = this.listQuery.taxonomies$;
	public readonly listError$ = this.listQuery.error$;
	public readonly isFetching$ = this.listQuery.isFetching$;
	public setIsFetching(isFetching = false): void {
		this.listStore.setIsFetching(isFetching);
	}
	public selectUIState(): Observable<TaxonomyUIModel> {
		return this.listQuery.selectUIState();
	}
	public getIsFetching(): boolean {
		return this.listQuery.getIsFetching();
	}

	// DETAIL STATES
	public readonly isCreating$ = this.detailQuery.isCreating$;
	public readonly activeTaxonomy$ = this.detailQuery.selectActive<
		TaxonomyDetailModel
	>() as Observable<TaxonomyDetailModel>;
	public readonly activeTaxonomyUI$ = this.detailQuery.ui.selectActive<
		TaxonomyDetailUIModel
	>() as Observable<TaxonomyDetailUIModel>;

	public selectTaxonomyUIState(taxonomyId: string): Observable<TaxonomyDetailUIModel> {
		return this.detailQuery.ui.selectEntity(taxonomyId);
	}

	// LIST FUNCTIONS
	public getTaxonomiesPaginated(
		searchParams: SearchParams,
		options?: GetTaxonomiesPaginatedPayloadOptions
	): Observable<PaginationResponse<TaxonomyListModel>> {
		const defaultOptions = {
			alertContainerId: TAXONOMIES_ALERT_CONTAINER_IDS.fetch,
			clearCache: false,
		};
		const serviceOptions = {
			...defaultOptions,
			...options,
		};
		if (serviceOptions.clearCache) {
			this.listPaginator.clearCache();
		}
		const alertMessages = getAlertMessages();

		return from(
			this.service
				.getTaxonomies(searchParams)
				.then(response => {
					const paging = response._page;

					this.listStore.update({
						paging,
						error: null,
					});

					return {
						perPage: paging.size,
						currentPage: taxonomiesListPaginator.currentPage,
						lastPage: paging.totalPages,
						total: paging.totalElements,
						data: response?._embedded.resourceList,
					};
				})
				.catch(error => {
					showAlert(serviceOptions.alertContainerId, 'error', alertMessages.fetch.error);
					this.listStore.update({
						error,
						isFetching: false,
					});
					throw error;
				})
		);
	}

	public getTaxonomies(searchParams?: SearchParams, options?: GetTaxonomiesPayloadOptions): void {
		const defaultOptions: GetTaxonomiesPayloadOptions = {
			alertContainerId: TAXONOMIES_ALERT_CONTAINER_IDS.fetch,
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
			.getTaxonomies(searchParams)
			.then(response => {
				if (response?._embedded.resourceList) {
					this.listStore.set(response._embedded.resourceList);
					this.listStore.update({
						error: false,
						isFetching: false,
					});
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

	// DETAIL FUNCTIONS
	public setActiveTaxonomy(taxonomyId: string): void {
		this.detailStore.setActive(taxonomyId);
		this.detailStore.ui.setActive(taxonomyId);
	}

	public removeActiveTaxonomy(): void {
		this.detailStore.setActive(null);
		this.detailStore.ui.setActive(null);
	}

	public hasActiveTaxonomy(taxonomyId: string): boolean {
		return this.detailQuery.hasActive(taxonomyId);
	}

	public hasTaxonomy(taxonomyId: string): boolean {
		return this.detailQuery.hasEntity(taxonomyId);
	}

	public createTaxonomy(
		payload: CreateTaxonomyPayload,
		options: CreateTaxonomyPayloadOptions = {
			successAlertContainerId: TAXONOMIES_ALERT_CONTAINER_IDS.create,
			errorAlertContainerId: TAXONOMIES_ALERT_CONTAINER_IDS.create,
		}
	): Promise<TaxonomyDetailResponse | void> {
		this.detailStore.setIsCreating(true);
		const alertMessages = getAlertMessages(payload.label);

		return this.service
			.createTaxonomy(payload)
			.then(taxonomy => {
				this.detailStore.update({
					isCreating: false,
					error: null,
				});
				this.detailStore.upsert(taxonomy.id, taxonomy);
				this.listPaginator.clearCache();

				// Timeout because the alert is visible on the edit page
				// and not on the create page
				setTimeout(() => {
					showAlert(
						options.successAlertContainerId,
						'success',
						alertMessages.create.success
					);
				}, 300);
				return taxonomy;
			})
			.catch(error => {
				showAlert(options.errorAlertContainerId, 'error', alertMessages.create.error);
				this.detailStore.update({
					isCreating: false,
					error,
				});
			});
	}

	public updateTaxonomy(
		payload: UpdateTaxonomyPayload,
		options: UpdateTaxonomyPayloadOptions = {
			alertContainerId: TAXONOMIES_ALERT_CONTAINER_IDS.create,
		}
	): Promise<TaxonomyDetailResponse | void> {
		this.detailStore.setIsUpdatingEntity(true, payload.uuid);
		const alertMessages = getAlertMessages(payload.label);

		return this.service
			.updateTaxonomy(payload)
			.then(taxonomy => {
				this.detailStore.ui.update(payload.uuid, {
					isUpdating: false,
					error: null,
				});
				this.detailStore.upsert(taxonomy.id, taxonomy);
				// update item in list?

				this.listPaginator.clearCache();
				showAlert(options.alertContainerId, 'success', alertMessages.update.success);
				return taxonomy;
			})
			.then(error => {
				showAlert(options.alertContainerId, 'error', alertMessages.update.error);
				this.detailStore.ui.update(payload.uuid, {
					isUpdating: false,
					error,
				});
			});
	}

	public getTaxonomy(taxonomyId: string, options?: GetTaxonomyPayloadOptions): Promise<void> {
		const defaultOptions = {
			alertContainerId: TAXONOMIES_ALERT_CONTAINER_IDS.fetchOne,
			force: false,
		};
		const serviceOptions = {
			...defaultOptions,
			...options,
		};
		if (this.detailQuery.hasEntity(taxonomyId) && !serviceOptions.force) {
			return Promise.resolve();
		}
		const alertMessages = getAlertMessages();
		this.detailStore.setIsFetchingEntity(true, taxonomyId);
		return this.service
			.getTaxonomy(taxonomyId)
			.then(response => {
				this.detailStore.upsert(response.id, response);
				this.detailStore.ui.upsert(response.id, { error: null, isFetching: false });
			})
			.catch(error => {
				showAlert(serviceOptions.alertContainerId, 'error', alertMessages.fetchOne.error);
				this.detailStore.ui.upsert(taxonomyId, {
					error,
					isFetching: false,
				});
			});
	}
}

export const taxonomiesFacade = new TaxonomiesFacade(
	taxonomiesListStore,
	taxonomiesListQuery,
	taxonomiesListPaginator,
	taxonomiesDetailStore,
	taxonomiesDetailQuery,
	taxonomiesApiService
);
