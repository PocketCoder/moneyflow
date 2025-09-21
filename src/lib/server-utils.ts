'use server';

import {auth} from '@/auth';
import {sql} from '@/lib/db';
import {Account} from './types';

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
