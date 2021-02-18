import {
	arrayAdd,
	arrayRemove,
	arrayUpdate,
	PaginationResponse,
	PaginatorPlugin,
} from '@datorama/akita';
import { SearchParams } from '@redactie/utils';
import { from, Observable } from 'rxjs';

import { showAlert } from '../../helpers';
import {
	CreateTaxonomyPayload,
	TaxonomiesApiService,
	taxonomiesApiService,
	TaxonomyDetailResponse,
	UpdateTaxonomySettingsPayload,
} from '../../services/taxonomies';
import {
	CreateTaxonomyTermPayload,
	TaxonomyTerm,
	taxonomyTermsApiService,
	TaxonomyTermsApiService,
	UpdateTaxonomyTermPayload,
	UpdateTaxonomyTermsPayload,
} from '../../services/taxonomyTerms';

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
import { getAlertMessages, getTermsAlertMessages } from './taxonomies.alertMessages';
import {
	TAXONOMIES_ALERT_CONTAINER_IDS,
	TAXONOMY_TERMS_ALERT_CONTAINER_IDS,
} from './taxonomies.const';
import {
	CreateTaxonomyPayloadOptions,
	GetTaxonomiesPaginatedPayloadOptions,
	GetTaxonomiesPayloadOptions,
	GetTaxonomyPayloadOptions,
	GetTaxonomyTermPayloadOptions,
	TaxonomyTermPayloadOptions,
	UpdateTaxonomyPayloadOptions,
} from './taxonomies.types';
import {
	TaxonomyTermDetailModel,
	TaxonomyTermDetailUIModel,
	taxonomyTermsDetailQuery,
	TaxonomyTermsDetailQuery,
	taxonomyTermsDetailStore,
	TaxonomyTermsDetailStore,
} from './terms';

export class TaxonomiesFacade {
	constructor(
		protected listStore: TaxonomiesListStore,
		protected listQuery: TaxonomiesListQuery,
		public listPaginator: PaginatorPlugin<TaxonomiesListState>,
		protected detailStore: TaxonomiesDetailStore,
		protected detailQuery: TaxonomiesDetailQuery,
		protected detailTermsStore: TaxonomyTermsDetailStore,
		protected detailTermsQuery: TaxonomyTermsDetailQuery,
		protected service: TaxonomiesApiService,
		protected termsService: TaxonomyTermsApiService
	) {}

	// LIST STATES
	public readonly taxonomies$ = this.listQuery.taxonomies$;
	public readonly listError$ = this.listQuery.error$;
	public readonly isFetching$ = this.listQuery.isFetching$;
	public readonly UIState$ = this.listQuery.selectUIState();
	public setIsFetching(isFetching = false): void {
		this.listStore.setIsFetching(isFetching);
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

	public selectTaxonomyUIState(taxonomyId?: number): Observable<TaxonomyDetailUIModel> {
		return this.detailQuery.ui.selectEntity(taxonomyId);
	}

	// DETAIL TERMS STATES
	public readonly isTermCreating$ = this.detailTermsQuery.isCreating$;
	public readonly activeTaxonomyTerm$ = this.detailTermsQuery.selectActive<
		TaxonomyTermDetailModel
	>() as Observable<TaxonomyTermDetailModel>;
	public readonly activeTaxonomyTermUI$ = this.detailTermsQuery.ui.selectActive<
		TaxonomyTermDetailUIModel
	>() as Observable<TaxonomyTermDetailUIModel>;

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
						data: response?._embedded,
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
				if (response?._embedded) {
					this.listStore.set(response._embedded);
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
	public setActiveTaxonomy(taxonomyId: number): void {
		this.detailStore.setActive(taxonomyId);
		this.detailStore.ui.setActive(taxonomyId);
	}

	public removeActiveTaxonomy(): void {
		this.detailStore.setActive(null);
		this.detailStore.ui.setActive(null);
	}

	public hasActiveTaxonomy(taxonomyId: number): boolean {
		return this.detailQuery.hasActive(taxonomyId);
	}

	public hasTaxonomy(taxonomyId: number): boolean {
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
		payload: UpdateTaxonomySettingsPayload,
		options: UpdateTaxonomyPayloadOptions = {
			alertContainerId: TAXONOMIES_ALERT_CONTAINER_IDS.create,
		}
	): Promise<TaxonomyDetailResponse | void> {
		this.detailStore.setIsUpdatingEntity(true, payload.id);
		const alertMessages = getAlertMessages(payload.body.label);

		return this.service
			.updateTaxonomySettings(payload)
			.then(taxonomy => {
				this.detailStore.ui.update(payload.id, {
					isUpdating: false,
					error: null,
				});
				this.detailStore.upsert(taxonomy.id, taxonomy);
				// update item in list?

				this.listPaginator.clearCache();
				showAlert(options.alertContainerId, 'success', alertMessages.update.success);
				return taxonomy;
			})
			.catch(error => {
				showAlert(options.alertContainerId, 'error', alertMessages.update.error);
				this.detailStore.ui.update(payload.id, {
					isUpdating: false,
					error,
				});
			});
	}

	public getTaxonomy(taxonomyId: number, options?: GetTaxonomyPayloadOptions): Promise<void> {
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
				this.detailTermsStore.add(response.terms);
			})
			.catch(error => {
				showAlert(serviceOptions.alertContainerId, 'error', alertMessages.fetchOne.error);
				this.detailStore.ui.upsert(taxonomyId, {
					error,
					isFetching: false,
				});
			});
	}

	public deleteTaxonomy(
		payload: TaxonomyDetailModel,
		options: CreateTaxonomyPayloadOptions = {
			successAlertContainerId: TAXONOMIES_ALERT_CONTAINER_IDS.delete,
			errorAlertContainerId: TAXONOMIES_ALERT_CONTAINER_IDS.delete,
		}
	): Promise<void> {
		this.detailStore.setIsDeletingEntity(true, payload.id);
		const alertMessages = getAlertMessages(payload.label);

		return this.service
			.deleteTaxonomy(payload.id)
			.then(() => {
				this.detailStore.remove(payload.id);
				this.listPaginator.clearCache();

				// Timeout because the alert is visible on the overview page
				// and not on the edit page
				setTimeout(() => {
					showAlert(
						options.successAlertContainerId,
						'success',
						alertMessages.delete.success
					);
				}, 300);
			})
			.catch(error => {
				showAlert(options.errorAlertContainerId, 'error', alertMessages.delete.error);
				this.detailStore.ui.upsert(payload.id, {
					error,
					isDeleting: false,
				});
			});
	}

	public updateTaxonomyTerms(
		payload: UpdateTaxonomyTermsPayload,
		options: UpdateTaxonomyPayloadOptions
	): Promise<TaxonomyTerm[] | void> {
		this.detailStore.setIsUpdatingEntity(true, payload.id);
		const alertMessages = getAlertMessages(payload.label);

		return this.termsService
			.updateTerms(payload.id, payload.body)
			.then(response => {
				const terms = response._embedded;

				this.detailStore.ui.update(payload.id, {
					isUpdating: false,
					error: null,
				});
				this.detailStore.upsert(payload.id, { terms });

				showAlert(options.alertContainerId, 'success', alertMessages.update.success);
				return terms;
			})
			.catch(error => {
				showAlert(options.alertContainerId, 'error', alertMessages.update.error);
				this.detailStore.ui.update(payload.id, {
					isUpdating: false,
					error,
				});
			});
	}

	// DETAIL TERMS FUNCTIONS
	public selectTaxonomyTermUIState(termId: number): Observable<TaxonomyTermDetailUIModel> {
		return this.detailTermsQuery.ui.selectEntity(termId);
	}

	public setActiveTaxonomyTerm(termId: number): void {
		this.detailTermsStore.setActive(termId);
		this.detailTermsStore.ui.setActive(termId);
	}

	public removeActiveTaxonomyTerm(): void {
		this.detailTermsStore.setActive(null);
		this.detailTermsStore.ui.setActive(null);
	}

	public hasActiveTaxonomyTerm(termId: number): boolean {
		return this.detailTermsQuery.hasActive(termId);
	}

	public hasTaxonomyTerm(termId: number): boolean {
		return this.detailTermsQuery.hasEntity(termId);
	}

	public createTaxonomyTerm(
		taxonomyId: number,
		payload: CreateTaxonomyTermPayload,
		options: TaxonomyTermPayloadOptions = {
			successAlertContainerId: TAXONOMY_TERMS_ALERT_CONTAINER_IDS.create,
			errorAlertContainerId: TAXONOMY_TERMS_ALERT_CONTAINER_IDS.create,
		}
	): Promise<TaxonomyTerm | void> {
		this.detailTermsStore.setIsCreating(true);
		const alertMessages = getTermsAlertMessages(payload.label);

		return this.termsService
			.createTerm(taxonomyId, payload)
			.then(taxonomyTerm => {
				// Update terms overview
				this.detailStore.update(taxonomyId, ({ terms = [] }) => ({
					terms: arrayAdd(terms, taxonomyTerm),
				}));
				// Update detail entity and ui
				this.detailTermsStore.update({
					isCreating: false,
					error: null,
				});
				this.detailTermsStore.upsert(taxonomyTerm.id, taxonomyTerm);

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
				this.detailTermsStore.update({
					isCreating: false,
					error,
				});
			});
	}

	public updateTaxonomyTerm(
		taxonomyId: number,
		payload: UpdateTaxonomyTermPayload,
		options: TaxonomyTermPayloadOptions = {
			successAlertContainerId: TAXONOMY_TERMS_ALERT_CONTAINER_IDS.update,
			errorAlertContainerId: TAXONOMY_TERMS_ALERT_CONTAINER_IDS.update,
		}
	): Promise<TaxonomyTerm | void> {
		this.detailTermsStore.setIsUpdatingEntity(true, payload.id);
		const alertMessages = getTermsAlertMessages(payload.label);

		return this.termsService
			.updateTerm(taxonomyId, payload)
			.then(taxonomyTerm => {
				// Update terms overview
				this.detailStore.update(taxonomyId, ({ terms }) => ({
					terms: arrayUpdate(terms, payload.id, payload as Partial<TaxonomyTerm>),
				}));
				// Update detail entity and ui
				this.detailTermsStore.ui.update(payload.id, {
					isUpdating: false,
					error: null,
				});
				this.detailTermsStore.upsert(taxonomyTerm.id, taxonomyTerm);

				// Timeout because the alert is visible on the edit page
				// and not on the create page
				setTimeout(() => {
					showAlert(
						options.successAlertContainerId,
						'success',
						alertMessages.update.success
					);
				}, 300);

				return taxonomyTerm;
			})
			.catch(error => {
				showAlert(options.errorAlertContainerId, 'error', alertMessages.update.error);
				this.detailTermsStore.ui.update(payload.id, {
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
		const alertMessages = getTermsAlertMessages();
		this.detailTermsStore.setIsFetchingEntity(true, termId);
		return this.termsService
			.getTerm(taxonomyId, termId)
			.then(response => {
				this.detailTermsStore.upsert(response.id, response);
				this.detailTermsStore.ui.upsert(response.id, { error: null, isFetching: false });
			})
			.catch(error => {
				showAlert(serviceOptions.alertContainerId, 'error', alertMessages.fetchOne.error);
				this.detailTermsStore.ui.upsert(termId, {
					error,
					isFetching: false,
				});
			});
	}

	public deleteTaxonomyTerm(
		taxonomyId: number,
		payload: TaxonomyTermDetailModel,
		options: TaxonomyTermPayloadOptions = {
			successAlertContainerId: TAXONOMY_TERMS_ALERT_CONTAINER_IDS.delete,
			errorAlertContainerId: TAXONOMY_TERMS_ALERT_CONTAINER_IDS.delete,
		}
	): Promise<void> {
		const alertMessages = getTermsAlertMessages(payload.label);
		this.detailTermsStore.setIsDeletingEntity(true, payload.id);

		return this.termsService
			.deleteTerm(taxonomyId, payload.id)
			.then(() => {
				// Update terms overview
				this.detailStore.update(taxonomyId, ({ terms }) => ({
					terms: arrayRemove(terms, payload.id),
				}));
				// Remove term
				this.detailTermsStore.remove(payload.id);

				// Timeout because the alert is visible on the term overview page
				// and not on the edit page
				setTimeout(() => {
					showAlert(
						options.successAlertContainerId,
						'success',
						alertMessages.delete.success
					);
				}, 300);
			})
			.catch(error => {
				showAlert(options.errorAlertContainerId, 'error', alertMessages.delete.error);
				this.detailStore.ui.upsert(payload.id, {
					error,
					isDeleting: false,
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
	taxonomyTermsDetailStore,
	taxonomyTermsDetailQuery,
	taxonomiesApiService,
	taxonomyTermsApiService
);
