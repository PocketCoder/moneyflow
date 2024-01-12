export type User = {
	id: number;
	username: string;
};

export type Pot = {
	name: string;
	created: Date;
	balance_history: Array<Balance>;
};

export type Balance = {
	date: Date;
	balance: number;
};

export type Account = {
	name: string;
	type: string;
	sub: Array<Pot>;
};
