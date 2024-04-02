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
	banks: string[]; // SELECT (parent) FROM accounts ; then .filter();
	accounts: object[];
	netWorth: number;
};
