// Common base types
type UUID = string;
type DateTime = string; // ISO string format

export enum AccountType {
	Savings = 'Savings',
	ISA = 'ISA',
	CurrentAccount = 'Current Account',
	Debt = 'Debt',
	Pension = 'Pension',
	NetWorth = 'Net Worth'
}

interface Preferences {
	goal: Record<string, number>[];
}

export interface UserData {
	id: UUID;
	name: string;
	auth0id: string;
	preferences: Preferences;
}

export interface Account {
	id: UUID;
	owner: UUID; // UserData.id
	name: string;
	type: AccountType;
	parent: string; // Bank
	tags: string[];
}

export interface BalanceData {
	id: UUID;
	account: UUID; // AccountData.id
	date: DateTime;
	amount: number;
}
