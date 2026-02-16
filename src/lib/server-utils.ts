'use server';

import {auth} from '@/auth';
import {sql} from '@/lib/db';
import {Account, BalanceData} from './types';
import {revalidatePath} from 'next/cache';
import {Session} from 'next-auth';
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
		const account = await sql`
			INSERT INTO bank_accounts (owner, name, type, parent)
			VALUES (
			${user.id},
			${account_name},
			${type},
			${bank}
			)`;
		revalidatePath('/accounts');
		revalidatePath('/');
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
		await calculateNetWorth([date]);
		revalidatePath('/accounts');
		revalidatePath('/');
		return {success: true, account_name};
	} catch (e) {
		console.error(e);
		throw new Error('Failed to create account.');
	}
}

export async function checkNetWorthRowExistsandCreate(userID: string): Promise<void> {
	try {
		const result = await sql`
			SELECT EXISTS(
				SELECT 1 
				FROM bank_accounts 
				WHERE owner = ${userID}
				AND name = 'Net Worth'
			) AS row_exists;
			`;

		if (!result || result.length === 0 || !result[0].row_exists) {
			await sql`
		INSERT INTO bank_accounts (owner, name, type, parent, tags)
		VALUES (${userID}, 'Net Worth', 'Net Worth', 'Net Worth', ARRAY['nw'])
		`;
		}
	} catch (e) {
		console.log(e);
		throw new Error(`Error: ${e}`);
	}
}

export async function recalculateNetWorthAction() {
	await calculateNetWorth();
	redirect('/settings');
}

export async function calculateNetWorth(dates?: string[]): Promise<void> {
	const user = await getCachedUser();
	if (!user) throw new Error('Unauthorized');

	// Ensure the Net Worth account exists first
	await checkNetWorthRowExistsandCreate(user.id);

	try {
		await sql`
		INSERT INTO balances (bank_account, date, amount)
		SELECT
			nw.id,
			b.date,
			SUM(b.amount)
		FROM balances b
		JOIN bank_accounts a ON b.bank_account = a.id
		JOIN users u ON a.owner = u.id
		JOIN bank_accounts nw ON nw.owner = u.id AND nw.name = 'Net Worth'
		WHERE 
			u.id = ${user.id}
			AND a.name <> 'Net Worth'
			AND (${dates}::date[] IS NULL OR b.date = ANY(${dates}::date[]))
		GROUP BY b.date, nw.id
		ON CONFLICT (bank_account, date)
		DO UPDATE SET amount = EXCLUDED.amount
	`;
		revalidatePath('/');
		revalidatePath('/accounts');
	} catch (e) {
		console.error(e);
		throw new Error('Failed to calculate net worth');
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
		return {success: true};
	} catch (e) {
		console.error(e);
		throw new Error('Failed to save balance.');
	}
}

export async function getNetWorthAccount(): Promise<Account> {
	const user = await getCachedUser();
	if (!user) throw new Error('Unauthorized');

	await checkNetWorthRowExistsandCreate(user.id);

	const accountResult = await sql`SELECT * FROM bank_accounts WHERE owner = ${user.id} AND name = 'Net Worth'`;
	const account = accountResult[0] as Account;
	return account;
}

export async function getAccount(accountID: string): Promise<Account> {
	try {
		const user = await getCachedUser();
		if (!user) throw new Error('Unauthorized');
		const accountResult = await sql`SELECT * FROM bank_accounts WHERE owner = ${user.id} AND id=${accountID}`;
		const account = accountResult[0] as Account;
		return account;
	} catch (e) {
		throw new Error(`Error: ${e}`);
	}
}

export async function getBalances(accountID: string): Promise<BalanceData[]> {
	const balancesResult = await sql`SELECT amount, date FROM balances WHERE bank_account = ${accountID}`;
	const balances = balancesResult as BalanceData[];
	return balances;
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

export async function changeAllTime(): Promise<{percChangeAT: number; absChangeAT: number}> {
	try {
		const user = await getCachedUser();
		if (!user) throw new Error('Unauthorized');
		const result = await sql`
			SELECT 
				b1.amount AS earliest_balance, 
				b2.amount AS latest_balance
			FROM balances b1
			JOIN bank_accounts a 
				ON b1.bank_account = a.id
			JOIN (
				SELECT bank_account, MAX(date) AS max_date
				FROM balances
				GROUP BY bank_account
			) b_latest 
				ON b1.bank_account = b_latest.bank_account
			JOIN balances b2 
				ON b2.bank_account = b_latest.bank_account 
			AND b2.date = b_latest.max_date
			WHERE a.name = 'Net Worth'
			AND a.owner = ${user.id}
			AND b1.date = (
				SELECT MIN(date)
				FROM balances
				WHERE bank_account = a.id
			)
		`;
		if (!result[0]) return {percChangeAT: 0, absChangeAT: 0};
		const balances = result[0] as {earliest_balance: string; latest_balance: string};
		const earliest = parseFloat(balances.earliest_balance);
		const latest = parseFloat(balances.latest_balance);
		const change = ((latest - earliest) / Math.abs(earliest)) * 100;
		const formatted = parseFloat(change.toPrecision(2));
		const absChange = latest - earliest;
		return {percChangeAT: formatted, absChangeAT: parseFloat(absChange.toFixed(2))};
	} catch (e) {
		throw new Error(`Error: ${e}`);
	}
}

export async function percentChangeFY(): Promise<{percChangeFY: number; absChangeFY: number}> {
	const {start, end} = getFinancialYearRange();
	try {
		const user = await getCachedUser();
		if (!user) throw new Error('Unauthorized');
		const result = await sql`
			SELECT 
				b1.amount AS earliest_balance, 
				b2.amount AS latest_balance
			FROM balances b1
			JOIN bank_accounts a 
				ON b1.bank_account = a.id
			JOIN (
				SELECT bank_account, MAX(date) AS max_date
				FROM balances
				WHERE date BETWEEN ${start} AND ${end}
				GROUP BY bank_account
			) b_latest 
				ON b1.bank_account = b_latest.bank_account
			JOIN balances b2 
				ON b2.bank_account = b_latest.bank_account 
			AND b2.date = b_latest.max_date
			WHERE a.name = 'Net Worth'
			AND a.owner = ${user.id}
			AND b1.date = (
				SELECT MIN(date)
				FROM balances
				WHERE bank_account = a.id
				AND date BETWEEN ${start} AND ${end}
			);
		`;
		if (!result[0]) return {percChangeFY: 0, absChangeFY: 0};
		const balances = result[0] as {earliest_balance: string; latest_balance: string};
		const earliest = parseFloat(balances.earliest_balance);
		const latest = parseFloat(balances.latest_balance);
		const change = ((latest - earliest) / Math.abs(earliest)) * 100;
		const formatted = change.toPrecision(2);
		const absChange = latest - earliest;
		return {percChangeFY: parseFloat(formatted), absChangeFY: parseFloat(absChange.toFixed(2))};
	} catch (e) {
		throw new Error(`Error: ${e}`);
	}
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

		await calculateNetWorth([isoDate]);
	} catch (e) {
		console.error(e);
		throw new Error('Failed to update balances');
	}

	redirect('/');
}

export async function DistPieChartData(): Promise<{account: string; balance: number}[]> {
	const user = await getCachedUser();
	if (!user) throw new Error('Unauthorized');

	try {
		const result = await sql`
			SELECT DISTINCT ON (a.id)
				a.name as account,
				b.amount as balance
			FROM bank_accounts a
			LEFT JOIN balances b ON a.id = b.bank_account
			WHERE a.owner = ${user.id}
			AND a.name <> 'Net Worth'
			ORDER BY a.id, b.date DESC
		`;

		return result.map((r) => ({
			account: r.account,
			balance: parseFloat(r.balance || 0)
		}));
	} catch (e) {
		console.error(e);
		throw new Error('Failed to fetch distribution data');
	}
}

export async function MoM(): Promise<{percMoM: number; absMoM: number}> {
	try {
		const user = await getCachedUser(); // Uses cache if already called
		if (!user) throw new Error('Unauthorized');
		const accountResult = await sql`SELECT * FROM bank_accounts WHERE owner = ${user.id} AND name = 'Net Worth'`;
		const account = accountResult[0] as Account;
		const balResult =
			await sql`SELECT amount FROM balances WHERE bank_account = ${account.id} ORDER BY date DESC LIMIT 2`;

		if (balResult.length < 2) {
			return {percMoM: 0, absMoM: 0};
		}

		const latest = parseFloat(balResult[0].amount);
		const earliest = parseFloat(balResult[1].amount);
		const change = ((latest - earliest) / Math.abs(earliest)) * 100;
		const formatted = change.toPrecision(2);
		const absChange = latest - earliest;
		return {percMoM: parseFloat(formatted), absMoM: parseFloat(absChange.toFixed(2))};
	} catch (e) {
		throw new Error(`Error: ${e}`);
	}
}

export async function YoY(): Promise<{percYoY: number; absYoY: number}> {
	try {
		const user = await getCachedUser(); // Uses cache if already called
		if (!user) throw new Error('Unauthorized');
		const accountResult = await sql`SELECT * FROM bank_accounts WHERE owner = ${user.id} AND name = 'Net Worth'`;
		const account = accountResult[0] as Account;

		const latestResult =
			await sql`SELECT amount, date FROM balances WHERE bank_account = ${account.id} ORDER BY date DESC LIMIT 1`;

		if (latestResult.length === 0) {
			return {percYoY: 0, absYoY: 0};
		}

		const latestAmount = parseFloat(latestResult[0].amount);
		const latestDate = new Date(latestResult[0].date);

		const priorYearDate = new Date(latestDate);
		priorYearDate.setFullYear(priorYearDate.getFullYear() - 1);

		const earliestResult =
			await sql`SELECT amount FROM balances WHERE bank_account = ${account.id} AND date <= ${priorYearDate.toISOString().split('T')[0]} ORDER BY date DESC LIMIT 1`;

		if (earliestResult.length === 0) {
			return {percYoY: 0, absYoY: 0};
		}

		const earliestAmount = parseFloat(earliestResult[0].amount);

		const change = ((latestAmount - earliestAmount) / Math.abs(earliestAmount)) * 100;
		const formatted = change.toPrecision(2);
		const absChange = latestAmount - earliestAmount;
		return {percYoY: parseFloat(formatted), absYoY: parseFloat(absChange.toFixed(2))};
	} catch (e) {
		throw new Error(`Error: ${e}`);
	}
}
