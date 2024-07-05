export type Pot = {
	id: string;
	name: string;
	amount: number;
	active: boolean;
};

export type Balance = {
	id: string;
	account: string; // ID of account
	date: Date;
	amount: number;
};

export type Account = {
	id: string;
	owner: string; // User ID
	name: string; // Name of account
	type: 'Savings' | 'ISA' | 'Current Account' | 'Debt';
	parent: string; // Name of bank
	include: boolean; // Include in net worth total and other calculations
	recentBalance: {
		// Not gotten from the server, calculated on retrieval
		date: Date;
		amount: string | number;
	};
	balanceHistory: Array<Balance>; // Not gotten from the server, calculated on retrieval
};

export type UserDataType = {
	id: string;
	authID: string;
	email: string;
	banks: string[];
	accounts: object[];
	netWorth: any;
	prefs: object;
};

type UUID = string;
type DateTime = string; // ISO string format
type Decimal = string; // Decimal as string for precision

// DB Types

export interface DBAccount {
	id: UUID;
	owner: UUID;
	name: string;
	type: string;
	parent: string;
	tags: string[];
}

export interface DBBalance {
	id: UUID;
	account: UUID;
	date: DateTime;
	amount: Decimal;
}

export interface DBUser {
	id: UUID;
	name: string;
	auth0id: string;
	preferences: any; // Use `any` type for JSON field
}

// Client Types

export interface CliUser {
	name: string;
	preferences: any; // Use `any` type for JSON field
}

export interface CliAccount {
	name: string;
	type: string;
	parent: string; // Bank
	tags: string[];
}

export interface CliBalance {
	account: string;
	amount: Decimal;
	date: DateTime;
}