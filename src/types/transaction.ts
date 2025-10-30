export interface AutoPayoutLog {
	id: number;
	customerId: number;
	customerPayoutRequestId: number;
	request: string;
	response: string;
	errorPoint: string;
	engine: string;
	transferReference: string;
	date: string; // ISO Date string
	initiatedAutomatically: boolean;
	status: boolean;
}

export interface NamedEntity {
	id: number;
	name: string;
}

export interface Transaction {
	customer: number;
	amount: number;
	details: string;
	date: string; // ISO Date string
	id: number;
	isPaid: boolean;
	payoutDetails: NamedEntity;
	payoutStatus: NamedEntity;
	payoutType: NamedEntity;
	customerName: string;
	accountNumber: string;
	accountName: string;
	bank: string;
	service: string;
	serviceName: string;
	autoPayoutLogs: AutoPayoutLog[];
	category: string;
}

export interface PaginatedResponse<T> {
	page: number;
	pageSize: number;
	totalCount: number;
	data: T[];
	totalPages: number;
}

export interface PayoutDetails {
	id: number;
	name: string;
}

export interface PayoutStatus {
	id: number;
	name: string;
}

export interface PayoutType {
	id: number;
	name: string;
}

export interface CustomerPayout {
	customer: number;
	amount: number;
	details: string;
	date: string; // ISO date string
	id: number;
	isPaid: boolean;
	payoutDetails: PayoutDetails;
	payoutStatus: PayoutStatus;
	payoutType: PayoutType;
	customerName: string;
	accountNumber: string;
	accountName: string;
	bank: string;
	service: 'WEBPAY' | string; // literal or generic string
	serviceName: string;
	autoPayoutLogs: AutoPayoutLog[];
}
