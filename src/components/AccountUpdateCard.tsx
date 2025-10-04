import {Account as AccountData, BalanceData} from '@/lib/types';
import Image from 'next/image';
import {sql} from '@/lib/db';
import {bankLogos} from '@/lib/bankLogos';
import {Card} from '@/components/Tremor/Card';
import {Input} from '@/components/Tremor/Input';
import BalanceSpark from '@/components/BalanceSpark';

export default async function AccountUpdateCard({account}: {account: AccountData}) {
	const balances = (await sql`SELECT * FROM balances WHERE account = ${account.id}`) as BalanceData[];
	const formattedBalances: BalanceData[] = balances
		.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
		.map((balance) => ({
			...balance,
			date: new Intl.DateTimeFormat('en-GB', {
				month: 'short',
				year: 'numeric'
			}).format(new Date(balance.date)),
			amount: balance.amount
		}));
	return (
		<Card className="flex h-[300px] min-w-[300px] flex-col items-start justify-evenly">
			{bankLogos[account.parent.toUpperCase()] ? (
				<Image src={bankLogos[account.parent.toUpperCase()]} alt={account.parent} width={80} height={30} />
			) : (
				<span className="text-md text-gray-800">{account.parent}</span>
			)}
			<h3 className="text-lg font-bold">{account.name}</h3>
			<BalanceSpark data={formattedBalances} type={account.type} width={'100%'} height={'33%'} />
			{formattedBalances.length > 0 && (
				<div className="my-2 flex flex-col items-start justify-start gap-1">
					<span className="text-sm text-gray-700">
						Last Balance: £{formattedBalances[formattedBalances.length - 1].amount}
					</span>
					<span className="text-xs text-gray-500">
						Updated on: {formattedBalances[formattedBalances.length - 1].date}
					</span>
				</div>
			)}
			<Input
				className="mt-2"
				type="number"
				step="any"
				name={`amount-${account.id}`}
				defaultValue={formattedBalances.length > 0 ? formattedBalances[formattedBalances.length - 1].amount : 0}
				placeholder="Enter new amount"
			/>
		</Card>
	);
}
