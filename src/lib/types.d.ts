// Common base types
type UUID = string;
type DateTime = string; // ISO string format
type Decimal = string | float; // Decimal as string for precision

enum AccountType {
	Savings = 'Savings',
	ISA = 'ISA',
	CurrentAccount = 'Current Account',
	Debt = 'Debt',
	Pension = 'Pension'
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

export interface AccountData {
	id: UUID;
	owner: UUID; // UserData.id
	name: string;
	type: AccountType;
	parent: string; // Bank
	tags: string[];
	/*
	balance: {
		amount: Decimal;
		updatedAt: DateTime;
	};*/
}

export interface BalanceData {
	id: UUID;
	account: UUID; // AccountData.id
	date: DateTime;
	amount: Decimal;
}
