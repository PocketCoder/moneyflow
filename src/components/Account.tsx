import type {AccountData, BalanceData} from '@/lib/types';
import {bankLogos} from '@/lib/bankLogos';
import clsx from 'clsx';
import Link from 'next/link';
import Image from 'next/image';
import {sql} from '@vercel/postgres';
import {Card} from '@/components/Tremor/Card';
import BalanceSpark from '@/components/BalanceSpark';

export default async function Account({account}: {account: AccountData}) {
	const balancesResult = await sql`SELECT * FROM balances WHERE account = ${account.id}`;
	const balances = balancesResult.rows as BalanceData[];
	const formattedBalances: BalanceData[] = balances
		.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
		.map((balance) => ({
			...balance,
			date: new Intl.DateTimeFormat('en-GB', {
				month: 'short',
				year: 'numeric'
			}).format(new Date(balance.date)),
			amount: parseFloat(balance.amount)
		}));
	return (
		<Link href={`/accounts/${account.id}`}>
			<Card
				className={clsx(
					'flex justify-between items-center w-full md:w-90 h-40 p-4 hover:scale-[101%] transition-transform gap-4',
					{
						'opacity-70': account.tags.includes('inactive'),
						'border-red-500 border-t-4': account.type === 'Debt',
						'border-purple-500 border-t-4': account.type === 'Pension'
					}
				)}>
				<div className="flex flex-col justify-evenly h-full">
					<h3 className="font-bold text-lg">{account.name}</h3>
					{bankLogos[account.parent.toUpperCase()] ? (
						<Image src={`${bankLogos[account.parent.toUpperCase()]}`} alt={account.parent} width={60} height={20} />
					) : (
						<span className="text-gray-800">{account.parent}</span>
					)}
					<span className="text-sm text-gray-500">{account.type}</span>
					<div>
						{account.tags.map((tag: string, i: number) => (
							<span key={i} className="text-sm text-blue-500">
								{i !== 0 ? ', ' : ''}
								{'#' + tag}
							</span>
						))}
					</div>
				</div>
				<BalanceSpark data={formattedBalances} type={account.type} width={150} height={'50%'} />
			</Card>
		</Link>
	);
}
