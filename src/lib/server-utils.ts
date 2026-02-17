'use server';

import {auth} from '@/auth';
import {sql} from '@/lib/db';
import {Account, BalanceData} from './types';
import {revalidateTag, unstable_cache} from 'next/cache';
import {getFinancialYearRange} from './utils';
import {redirect} from 'next/navigation';
import {cache} from 'react';

export const getCachedUser = cache(async () => {
	const session = await auth();
	if (!session?.user?.email) return null;

	const result = await sql`SELECT id FROM users WHERE email = ${session.user.email}`;
	return result[0];
});

export async function saveNewAccount(
	prevState: {success: boolean; account_name?: string; error?: string},
	data: FormData
): Promise<{success: boolean; account_name?: string; error?: string}> {
	const user = await getCachedUser();
	if (!user) throw new Error('Unauthorized');

	const account_name = data.get('account_name') as string;
	const bank = data.get('bank') as string;
	const type = data.get('type') as string;

	try {
		await sql`
			INSERT INTO bank_accounts (owner, name, type, parent)
			VALUES (
			${user.id},
			${account_name},
			${type},
			${bank}
			)`;
		revalidateTag('accounts', 'max');
		return {success: true, account_name};
	} catch (e) {
		console.error(e);
		return {success: false, error: 'Failed to create account.'};
	}
}

export async function saveNewAccountAndBalance(data: FormData): Promise<{success: boolean; account_name?: string}> {
	const user = await getCachedUser();
	if (!user) throw new Error('Unauthorized');

	const account_name = data.get('account_name') as string;
	const bank = data.get('bank') as string;
	const type = data.get('type') as string;
	const date = data.get('date') as string;
	const balance = data.get('balance') as string;

	try {
		const account = await sql`
			INSERT INTO bank_accounts (owner, name, type, parent)
			VALUES (
			${user.id},
			${account_name},
			${type},
			${bank}
			)
			RETURNING *
			`;
		const accountRow = account[0] as Account;
		const accountID = accountRow.id;
		await saveBalance(accountID, date, balance);
		revalidateTag('accounts', 'max');
		revalidateTag('balances', 'max');
		return {success: true, account_name};
	} catch (e) {
		console.error(e);
		throw new Error('Failed to create account.');
	}
}

export async function saveBalance(accountID: string, date: string, balance: string): Promise<{success: boolean}> {
	if (!accountID || !date || !balance) {
		throw new Error('Missing parameters.');
	}
	try {
		await sql`
		INSERT INTO balances (bank_account, date, amount)
		VALUES (
			${accountID},
			${date},
			${balance}
		)`;
		revalidateTag('balances', 'max');
		return {success: true};
	} catch (e) {
		console.error(e);
		throw new Error('Failed to save balance.');
	}
}

export async function getAccount(accountID: string) {
	const user = await getCachedUser();
	if (!user) throw new Error('Unauthorized');
	return unstable_cache(
		async (uId: string, aId: string): Promise<Account> => {
			const accountResult = await sql`SELECT * FROM bank_accounts WHERE owner = ${uId} AND id=${aId}`;
			return accountResult[0] as Account;
		},
		['account-detail', user.id, accountID],
		{tags: ['accounts']}
	)(user.id, accountID);
}

export async function getBalances(accountID: string) {
	return unstable_cache(
		async (aId: string): Promise<BalanceData[]> => {
			const balancesResult = await sql`SELECT amount, date FROM balances WHERE bank_account = ${aId} ORDER BY date ASC`;
			return balancesResult as BalanceData[];
		},
		['balances-list', accountID],
		{tags: ['balances']}
	)(accountID);
}

export async function getNetWorthHistory() {
	const user = await getCachedUser();
	if (!user) throw new Error('Unauthorized');
	return unstable_cache(
		async (uId: string): Promise<BalanceData[]> => {
			const result = await sql`
				SELECT total_net_worth as amount, date 
				FROM net_worth_history 
				WHERE owner = ${uId} 
				ORDER BY date ASC
			`;
			return result as BalanceData[];
		},
		['net-worth-history', user.id],
		{tags: ['balances']}
	)(user.id);
}

export async function isNewUser(): Promise<boolean> {
	try {
		const user = await getCachedUser();
		if (!user) throw new Error('Unauthorized');
		const accounts = (await sql`SELECT * FROM bank_accounts WHERE owner = ${user.id}`) as Account[];
		return accounts.length === 0;
	} catch (e) {
		throw new Error(`Error: ${e}`);
	}
}

export async function changeAllTime() {
	const user = await getCachedUser();
	if (!user) throw new Error('Unauthorized');
	return unstable_cache(
		async (uId: string): Promise<{percChangeAT: number; absChangeAT: number}> => {
			const result = await sql`
				WITH dates AS (
					   SELECT MIN(date) as start_date, MAX(date) as end_date
					   FROM net_worth_history
					   WHERE owner = ${uId}
				   )
				   SELECT 
					   (SELECT total_net_worth FROM net_worth_history WHERE owner = ${uId} AND date = d.start_date) as earliest_balance,
					   (SELECT total_net_worth FROM net_worth_history WHERE owner = ${uId} AND date = d.end_date) as latest_balance
				   FROM dates d
			`;
			if (!result[0] || result[0].earliest_balance === null) return {percChangeAT: 0, absChangeAT: 0};
			const earliest = parseFloat(result[0].earliest_balance);
			const latest = parseFloat(result[0].latest_balance);
			const change = ((latest - earliest) / Math.abs(earliest)) * 100;
			return {percChangeAT: parseFloat(change.toPrecision(2)), absChangeAT: parseFloat((latest - earliest).toFixed(2))};
		},
		['stats-all-time', user.id],
		{tags: ['balances']}
	)(user.id);
}

export async function percentChangeFY() {
	const user = await getCachedUser();
	if (!user) throw new Error('Unauthorized');
	return unstable_cache(
		async (uId: string): Promise<{percChangeFY: number; absChangeFY: number}> => {
			const {start, end} = getFinancialYearRange();
			const result = await sql`
				WITH range_data AS (
					SELECT total_net_worth as amount, date
					FROM net_worth_history
					WHERE owner = ${uId} AND date BETWEEN ${start} AND ${end}
				)
				SELECT 
					(SELECT amount FROM range_data ORDER BY date ASC LIMIT 1) as earliest_balance,
					(SELECT amount FROM range_data ORDER BY date DESC LIMIT 1) as latest_balance
			`;
			if (!result[0] || result[0].earliest_balance === null) return {percChangeFY: 0, absChangeFY: 0};
			const earliest = parseFloat(result[0].earliest_balance);
			const latest = parseFloat(result[0].latest_balance);
			const change = ((latest - earliest) / Math.abs(earliest)) * 100;
			const formatted = change.toPrecision(2);
			const absChange = latest - earliest;
			return {percChangeFY: parseFloat(formatted), absChangeFY: parseFloat(absChange.toFixed(2))};
		},
		['stats-fy', user.id],
		{tags: ['balances']}
	)(user.id);
}

export async function updateBalances(formData: FormData) {
	const dateStr = formData.get('date') as string;
	const date = new Date(dateStr);
	const isoDate = date.toISOString().split('T')[0];

	const balanceEntries = Array.from(formData.entries())
		.filter(([key]) => key.startsWith('amount-'))
		.map(([key, value]) => ({
			account: key.replace('amount-', ''),
			amount: parseFloat(value.toString())
		}))
		.filter((balance) => !isNaN(balance.amount));

	if (balanceEntries.length === 0) {
		throw new Error('No balance values provided');
	}

	try {
		const accounts = balanceEntries.map((b) => b.account);
		const amounts = balanceEntries.map((b) => b.amount);
		const dates = balanceEntries.map(() => isoDate);

		await sql`
			INSERT INTO balances (bank_account, amount, date)
			SELECT * FROM UNNEST(${accounts}::uuid[], ${amounts}::numeric[], ${dates}::date[])
			ON CONFLICT (bank_account, date) DO UPDATE SET amount = EXCLUDED.amount;
		`;

		revalidateTag('balances', 'max');
	} catch (e) {
		console.error(e);
		throw new Error('Failed to update balances');
	}

	redirect('/');
}

export async function DistPieChartData() {
	const user = await getCachedUser();
	if (!user) throw new Error('Unauthorized');
	return unstable_cache(
		async (uId: string): Promise<{account: string; balance: number}[]> => {
			const result = await sql`
				SELECT DISTINCT ON (a.id)
					a.name as account,
					b.amount as balance
				FROM bank_accounts a
				LEFT JOIN balances b ON a.id = b.bank_account
				WHERE a.owner = ${uId}
				AND a.name <> 'Net Worth'
				ORDER BY a.id, b.date DESC
			`;

			return result.map((r) => ({
				account: r.account,
				balance: parseFloat(r.balance || 0)
			}));
		},
		['pie-chart-data', user.id],
		{tags: ['balances', 'accounts']}
	)(user.id);
}

export async function MoM() {
	const user = await getCachedUser();
	if (!user) throw new Error('Unauthorized');
	return unstable_cache(
		async (uId: string): Promise<{percMoM: number; absMoM: number}> => {
			const balResult = await sql`
				   SELECT total_net_worth as amount 
				   FROM net_worth_history 
				   WHERE owner = ${uId} 
				   ORDER BY date DESC 
				   LIMIT 2
			   `;

			if (balResult.length < 2) return {percMoM: 0, absMoM: 0};

			const latest = parseFloat(balResult[0].amount);
			const earliest = parseFloat(balResult[1].amount);
			const change = ((latest - earliest) / Math.abs(earliest)) * 100;
			return {percMoM: parseFloat(change.toPrecision(2)), absMoM: parseFloat((latest - earliest).toFixed(2))};
		},
		['stats-mom', user.id],
		{tags: ['balances']}
	)(user.id);
}

export async function YoY() {
	const user = await getCachedUser();
	if (!user) throw new Error('Unauthorized');
	return unstable_cache(
		async (uId: string): Promise<{percYoY: number; absYoY: number}> => {
			const latestResult = await sql`
				SELECT total_net_worth as amount, date 
				FROM net_worth_history 
				WHERE owner = ${uId} 
				ORDER BY date DESC 
				LIMIT 1
			`;

			if (latestResult.length === 0) {
				return {percYoY: 0, absYoY: 0};
			}

			const latestAmount = parseFloat(latestResult[0].amount);
			const latestDate = new Date(latestResult[0].date);

			const priorYearDate = new Date(latestDate);
			priorYearDate.setFullYear(priorYearDate.getFullYear() - 1);

			const earliestResult = await sql`
				SELECT total_net_worth as amount 
				FROM net_worth_history 
				WHERE owner = ${uId} 
				AND date <= ${priorYearDate.toISOString().split('T')[0]} 
				ORDER BY date DESC 
				LIMIT 1
			`;

			if (earliestResult.length === 0) {
				return {percYoY: 0, absYoY: 0};
			}

			const earliestAmount = parseFloat(earliestResult[0].amount);

			const change = ((latestAmount - earliestAmount) / Math.abs(earliestAmount)) * 100;
			const formatted = change.toPrecision(2);
			const absChange = latestAmount - earliestAmount;
			return {percYoY: parseFloat(formatted), absYoY: parseFloat(absChange.toFixed(2))};
		},
		['stats-yoy', user.id],
		{tags: ['balances']}
	)(user.id);
}
