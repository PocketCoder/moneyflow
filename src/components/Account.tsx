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
					'flex h-40 w-full items-center justify-between gap-4 p-4 transition-transform hover:scale-[101%] md:w-90',
					{
						'opacity-70': account.tags.includes('inactive'),
						'border-t-4 border-red-500': account.type === 'Debt',
						'border-t-4 border-purple-500': account.type === 'Pension'
					}
				)}>
				<div className="flex h-full flex-col justify-evenly">
					<h3 className="text-lg font-bold">{account.name}</h3>
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
