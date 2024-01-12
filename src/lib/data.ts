import {sql} from '@vercel/postgres';

export async function fetchAccounts(userID: string) {
	const data = await sql`
        SELECT 
            a.id AS id,
            a.name AS name,
            a.type AS type,
            a.parent AS parent
        FROM 
            accounts a
        WHERE 
            a.owner = ${userID}
    `;
	return data.rows;
}

export async function fetchBalances(accountID: string) {
	const data = await sql`
        SELECT
            b.date AS date,
            b.amount AS balance
        FROM
            balances b
        WHERE
            b.account = ${accountID}
    `;
	return data.rows;
}
