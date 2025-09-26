'use server';

import {auth} from '@/auth';
import {sql} from '@/lib/db';
import {Account, BalanceData} from './types';
import {revalidatePath} from 'next/cache';
import {redirect} from 'next/navigation';
import {Session} from 'next-auth';

export async function saveNewAccountAndBalance(data: FormData): Promise<{success: boolean; account_name?: string}> {
	/* Used on Welcome ONLY */
	const session = await auth();
	if (!session) throw new Error('Not logged in');

	const account_name = data.get('account_name') as string;
	const bank = data.get('bank') as string;
	const type = data.get('type') as string;
	const date = data.get('date') as string;
	const balance = data.get('balance') as string;

	try {
		const account = await sql`
			INSERT INTO accounts (owner, name, type, parent)
			VALUES (
			(SELECT id FROM users WHERE email = ${session.user?.email}),
			${account_name},
			${type},
			${bank}
			)
			RETURNING *
			`;
		const accountRow = account[0] as Account;
		const accountID = accountRow.id;
		await saveBalance(accountID, date, balance);
		revalidatePath('/accounts');
		revalidatePath('/');
		return {success: true, account_name};
	} catch (e) {
		console.error(e);
		throw new Error('Failed to create account.');
	}
}

async function checkNetWorthRowExistsandCreate(session: Session): Promise<void> {
	try {
		const result = await sql`
			SELECT EXISTS(
				SELECT 1 
				FROM accounts 
				WHERE owner = (SELECT id FROM users WHERE email = ${session.user?.email})
				AND name = 'Net Worth'
			) AS row_exists;
			`;

		if (!result[0].row_exists) {
			await sql`
		INSERT INTO accounts (owner, name, type, parent, tags)
		VALUES ((SELECT id FROM users WHERE email = ${session.user?.email}), 'Net Worth', 'Net Worth', 'Net Worth', ARRAY['nw'])
		`;
		}
	} catch (e) {
		console.log(e);
		throw new Error(`Error: ${e}`);
	}
}

export async function calculateNetWorth() {
	const session = await auth();
	if (!session) throw new Error('Not logged in');

	try {
		const dates = (await sql`
			SELECT DISTINCT b.date
			FROM balances b
			JOIN accounts a ON b.account = a.id
			WHERE a.owner = (SELECT id FROM users WHERE email = ${session.user?.email})
		`) as {date: string}[];

		for (const uniqueDate of dates) {
			const balances = (await sql`
			SELECT amount
			FROM balances b
			JOIN accounts a ON b.account = a.id
			WHERE a.owner = (SELECT id FROM users WHERE email = ${session.user?.email}) AND b.date = ${uniqueDate.date}
			`) as {amount: string}[];

			let total: number = 0;

			for (const balance of balances) {
				total += parseFloat(balance.amount);
			}

			const netWorthAccount = await getNetWorthAccount();

			await sql`
			INSERT INTO balances (account, date, amount)
			VALUES (${netWorthAccount.id}, ${uniqueDate.date}, ${total})
			`;
		}
	} catch (e) {
		console.error(e);
		throw new Error('Failed to calculate net worth');
	}
}

async function saveBalance(accountID: string, date: string, balance: string): Promise<{success: boolean}> {
	try {
		await sql`
		INSERT INTO balances (account, date, amount)
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

/*
export async function getUserID(session: Session): Promise<number> {
	const userEmail = session?.user?.email;
	const userDB = await sql`SELECT * FROM users WHERE email = ${userEmail}`;
	const userID = userDB.rows[0].id;
	return userID;
}
*/

export async function getNetWorthAccount(): Promise<Account> {
	const session = await auth();
	if (!session) throw new Error('Not logged in');
	await checkNetWorthRowExistsandCreate(session);
	const accountResult =
		await sql`SELECT * FROM accounts WHERE owner = (SELECT id FROM users WHERE email = ${session.user?.email}) AND name = 'Net Worth'`;
	const account = accountResult[0] as Account;
	return account;
}

export async function getAccount(accountID: string, userID: string | number): Promise<Account> {
	const accountResult = await sql`SELECT * FROM accounts WHERE owner=${userID} AND id=${accountID}`;
	const account = accountResult.rows[0] as Account;
	return account;
}

export async function getBalances(accountID: string): Promise<BalanceData[]> {
	const balancesResult = await sql`SELECT amount, date FROM balances WHERE account = ${accountID}`;
	const balances = balancesResult.rows as BalanceData[];
	return balances;
}
