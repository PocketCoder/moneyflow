// Tremor Raw cx [v0.0.0]

import {Session} from '@auth0/nextjs-auth0';
import {UserProfile} from '@auth0/nextjs-auth0/client';
import {sql} from '@vercel/postgres';
import clsx, {type ClassValue} from 'clsx';
import {twMerge} from 'tailwind-merge';
import {AccountData, BalanceData} from './types';

export function cx(...args: ClassValue[]) {
	return twMerge(clsx(...args));
}

// Tremor Raw focusInput [v0.0.1]

export const focusInput = [
	// base
	'focus:ring-2',
	// ring color
	'focus:ring-blue-200 focus:dark:ring-blue-700/30',
	// border color
	'focus:border-blue-500 focus:dark:border-blue-700'
];

// Tremor Raw focusRing [v0.0.1]

export const focusRing = [
	// base
	'outline outline-offset-2 outline-0 focus-visible:outline-2',
	// outline color
	'outline-blue-500 dark:outline-blue-500'
];

// Tremor Raw hasErrorInput [v0.0.1]

export const hasErrorInput = [
	// base
	'ring-2',
	// border color
	'border-red-500 dark:border-red-700',
	// ring color
	'ring-red-200 dark:ring-red-700/30'
];

export const formatter = new Intl.NumberFormat('en-GB', {
	style: 'currency',
	currency: 'GBP',
	trailingZeroDisplay: 'stripIfInteger'
});

export const currencyFormatter = (value: number | string) => {
	value = parseFloat(value.toString());
	return formatter.format(value);
};

export async function getUserID(session: Session): Promise<number> {
	const user: UserProfile | undefined = session?.user;
	const auth0id = user!.sub!.split('|')[1];
	const userDB = await sql`SELECT * FROM users WHERE auth0id = ${auth0id}`;
	const userID = userDB.rows[0].id;
	return userID;
}

export async function getNetWorthAccount(userID: number): Promise<AccountData> {
	const accountResult = await sql`SELECT * FROM accounts WHERE owner=${userID} AND name='Net Worth'`;
	const account = accountResult.rows[0] as AccountData;
	return account;
}

export async function getAccount(accountID: string, userID: string | number): Promise<AccountData> {
	const accountResult = await sql`SELECT * FROM accounts WHERE owner=${userID} AND id=${accountID}`;
	const account = accountResult.rows[0] as AccountData;
	return account;
}

export async function getBalances(accountID: string): Promise<BalanceData[]> {
	const balancesResult = await sql`SELECT amount, date FROM balances WHERE account = ${accountID}`;
	const balances = balancesResult.rows as BalanceData[];
	return balances;
}

export function formatBalances(balances: BalanceData[]): BalanceData[] {
	return balances
		.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
		.map((balance) => ({
			...balance,
			date: new Intl.DateTimeFormat('en-GB', {
				month: 'short',
				year: 'numeric'
			}).format(new Date(balance.date)),
			amount: balance.amount ? parseFloat(balance.amount) || 0 : 0
		}));
}

export function getDiffPercent(balances: BalanceData[]): number | string {
	const diff = balances[balances.length - 1].amount - balances[0].amount;
	let diffPercent = ((diff / balances[0].amount) * 100).toFixed(0);
	return (diffPercent = Number.isNaN(diffPercent) || diffPercent === 'Infinity' ? 'N/A' : diffPercent);
}
