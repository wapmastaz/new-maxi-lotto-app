import type { User } from './user';

export interface defaultApiResponse {
	success: boolean;
	message: string;
}

export interface dataApiResponse {
	page: number;
	pageSize: number;
	totalCount: number;
	totalPages: number;
}

export interface UpdateProfileResponse {
	success: boolean;
	message: string;
	user: User;
}

export interface UserApiResponse {
	success: boolean;
	user: User;
}

export interface CreatorsApiResponse {
	success: boolean;
	creators: User[];
}

export interface DepositResponse {
	isReversal: boolean;
	transactionRefrence: string;
	paymentUrl: string | null;
	ussdCode: string | null;
	service: number;
	provider: number;
	serviceName: string;
	providerName: string;
	customer: number;
	amount: number;
	details: string;
	date: string; // ISO string (e.g., "0001-01-01T00:00:00")
}

export interface LatestDrawTicketResponse {
	gameName: string;
	gameID: number;
	templateGameId: number;
	gameType: string;
	gameDay: string;
	gameImageUrl: string;
	gameBackgroundImageUrl: string;
	gameCode: string;
	date: string; // ISO Date string
	startDateTime: string; // ISO Date string
	endDateTime: string; // ISO Date string
	isValidated: boolean;
	isActive: boolean;
	isGhanaGame: boolean;
	result: {
		winningBall1: number;
		winningBall2: number;
		winningBall3: number;
		winningBall4: number;
		winningBall5: number;
		machineBall1: number;
		machineBall2: number;
		machineBall3: number;
		machineBall4: number;
		machineBall5: number;
	};
}
