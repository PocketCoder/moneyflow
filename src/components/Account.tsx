import type {Account as AccountData, BalanceData} from '@/lib/types';
import {bankLogos} from '@/lib/bankLogos';
import clsx from 'clsx';
import Link from 'next/link';
import Image from 'next/image';
import {sql} from '@/lib/db';
import {Card} from '@/components/Tremor/Card';
import BalanceSpark from '@/components/BalanceSpark';

import {formatBalances} from '@/lib/utils';

export default async function Account({account}: {account: AccountData}) {
	const balances =
		(await sql`SELECT * FROM balances WHERE bank_account = ${account.id} ORDER BY date ASC`) as BalanceData[];
	const formattedBalances: BalanceData[] = formatBalances(balances);
	return (
		<Link href={`/accounts/${account.id}`}>
			<Card
				className={clsx(
					'flex h-40 w-full items-center justify-between gap-4 p-4 transition-transform hover:scale-[101%] md:w-90',
					{
						'opacity-70': account.tags.includes('inactive'),
						'border-destructive border-t-4': account.type === 'Debt',
						'border-chart-3 border-t-4': account.type === 'Pension'
					}
				)}>
				<div className="flex h-full flex-col justify-evenly">
					<h3 className="text-lg font-bold">{account.name}</h3>
					{bankLogos[account.parent.toUpperCase()] ? (
						<Image src={`${bankLogos[account.parent.toUpperCase()]}`} alt={account.parent} width={60} height={20} />
					) : (
						<span className="text-foreground">{account.parent}</span>
					)}
					<span className="text-muted-foreground text-sm">{account.type}</span>
					<div>
						{account.tags.map((tag: string, i: number) => (
							<span key={i} className="text-accent text-sm">
								{i !== 0 ? ', ' : ''}
								{'#' + tag}
							</span>
						))}
					</div>
				</div>
				<BalanceSpark data={formattedBalances} type={account.type} width={150} height={50} />
			</Card>
		</Link>
	);
}
