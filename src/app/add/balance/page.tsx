import type {AccountData, BalanceData} from '@/lib/types';
import {revalidatePath} from 'next/cache';
import {sql} from '@vercel/postgres';
import {Input} from '@/components/Tremor/Input';
import AccountUpdateCard from '@/components/AccountUpdateCard';
import {Button} from '@/components/Tremor/Button';

async function updateBalances(formData: FormData) {
	'use server';

	const date = new Date(formData.get('date') as string);
	//const accounts = JSON.parse(formData.get('accounts') as string) as AccountData[];

	try {
		const balanceEntries: Partial<BalanceData>[] = Array.from(formData.entries())
			.filter(([key]) => key.startsWith('amount-'))
			.map(([key, value]) => ({
				account: key.replace('amount-', ''),
				amount: value,
				date: date.toDateString()
			}))
			.filter((balance) => balance.amount); // Only include non-empty values

		if (balanceEntries.length === 0) {
			throw new Error('No balance values provided');
		}
		// FIXME: Add exclusion constraint
		for (const b of balanceEntries) {
			await sql`
				INSERT INTO balances (account, amount, date)
				VALUES (${b.account}, ${b.amount}, ${b.date})
				ON CONFLICT (account, date) DO UPDATE SET amount = ${b.amount};
			`;
		}

		revalidatePath('/accounts');
	} catch (error) {
		console.error('Error updating balances:', error);
		throw new Error('Failed to update balances');
	}
}

export default async function AddBalance() {
	const {rows}: {rows: AccountData[]} = await sql`SELECT * FROM accounts WHERE owner=${process.env.USERID}`;
	return (
		<form action={updateBalances}>
			<section>
				<h1 className="text-center mb-2 font-bold text-lg">Update Balances</h1>
				<Input type="date" name="date" defaultValue={new Date().toISOString().split('T')[0]} className="mb-2" />
				<div className="flex gap-8 flex-nowrap w-full h-full overflow-x-scroll">
					{rows.map((account, i) => (
						<AccountUpdateCard key={i} account={account} />
					))}
				</div>
				<Button type="submit" className="mt-4">
					Save All
				</Button>
			</section>
		</form>
	);
}
