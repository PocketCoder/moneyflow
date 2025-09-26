import type {Account as AccountData} from '@/lib/types';
import Account from '@/components/Account';
import {getAllAccounts} from '@/lib/server-utils';

export default async function Accounts() {
	const allAccounts = await getAllAccounts();
	const groupedAccounts = allAccounts.reduce((groups: Record<string, AccountData[]>, account) => {
		const bank = account.parent || 'Other';
		if (!groups[bank]) {
			groups[bank] = [];
		}
		groups[bank].push(account);
		return groups;
	}, {});
	const ordered = Object.keys(groupedAccounts)
		.sort()
		.reduce((obj: Record<string, AccountData[]>, key) => {
			obj[key] = groupedAccounts[key];
			return obj;
		}, {});
	return (
		<section className="mt-2 flex flex-wrap gap-4">
			{Object.entries(ordered).map(([bank, accounts]) =>
				bank === 'Net Worth' ? null : (
					<div key={bank} className="space-y-2">
						<h2 className="text-xl font-semibold">{bank}</h2>
						<section className="flex flex-wrap gap-4">
							{accounts.map((account: AccountData, i: number) => (
								<Account key={`${bank}-${i}`} account={account} />
							))}
						</section>
					</div>
				)
			)}
		</section>
	);
}
