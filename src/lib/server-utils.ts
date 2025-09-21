'use server';

import {auth} from '@/auth';
import {sql} from '@/lib/db';
import {Account, BalanceData} from './types';
import {Session} from 'next-auth';

export async function saveNewAccountAndBalance(data: FormData) {
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
		await sql`
            INSERT INTO balances (account, date, amount)
            VALUES (
                ${accountID},
                ${date},
                ${balance}
            )
        `;
	} catch (e) {
		console.log(e);
	}
}

export async function getUserID(session: Session): Promise<number> {
	const userEmail = session?.user?.email;
	const userDB = await sql`SELECT * FROM users WHERE email = ${userEmail}`;
	const userID = userDB.rows[0].id;
	return userID;
}

export async function getNetWorthAccount(userID: number): Promise<Account> {
	const accountResult = await sql`SELECT * FROM accounts WHERE owner=${userID} AND name='Net Worth'`;
	const account = accountResult.rows[0] as Account;
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
