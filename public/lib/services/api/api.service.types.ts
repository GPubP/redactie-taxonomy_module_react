export interface PaginatedResponse<Data> {
	_embedded: Data;
	_page: {
		number: number;
		size: number;
		totalElements: number;
		totalPages: number;
	};
}
