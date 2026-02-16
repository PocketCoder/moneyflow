import type {Account as AccountData, BalanceData} from '@/lib/types';
import {sql} from '@/lib/db';
import {Input} from '@/components/Tremor/Input';
import AccountUpdateCard from '@/components/AccountUpdateCard';
import {Button} from '@/components/Tremor/Button';
import React from 'react';
import {getCachedUser, updateBalances} from '@/lib/server-utils';
import {redirect} from 'next/navigation';

export default async function AddBalance() {
	const user = await getCachedUser();
	if (!user) redirect('/welcome');
	const rows =
		(await sql`SELECT * FROM bank_accounts WHERE owner = ${user.id} ORDER BY parent ASC, name ASC`) as AccountData[];
	return (
		<form action={updateBalances}>
			<section>
				<h1 className="mb-2 scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">
					Update Balances
				</h1>
				<Input type="date" name="date" defaultValue={new Date().toISOString().split('T')[0]} className="mb-2" />
				<div className="flex h-full w-full flex-nowrap gap-8 overflow-x-scroll">
					{rows.map((account, i) => {
						if (account.name == 'Net Worth') return <React.Fragment key={i}></React.Fragment>;
						return <AccountUpdateCard key={account.id} account={account} />;
					})}
				</div>
				<Button type="submit" className="mt-4">
					Save All
				</Button>
			</section>
		</form>
	);
}
