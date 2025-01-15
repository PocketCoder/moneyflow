import type {AccountData, BalanceData} from '@/lib/types';
import {bankLogos} from '@/lib/bankLogos';
import Link from 'next/link';
import Image from 'next/image';
import {sql} from '@vercel/postgres';
import {ChevronLeftIcon} from '@heroicons/react/24/outline';
import {PencilIcon} from '@heroicons/react/24/outline';
import {Card} from '@/components/Tremor/Card';
import HistoryTable from '@/components/HistoryTable';
import BalanceChart from '@/components/BalanceChart';
import {formatter} from '@/lib/utils';

export default async function AccountPage({params}: {params: Promise<{id: string}>}) {
	const id = (await params).id;
	const accountResult = await sql`SELECT * FROM accounts WHERE owner=${process.env.USERID} AND id=${id}`;
	const balancesResult = await sql`SELECT amount, date FROM balances WHERE account = ${id}`;
	const account = accountResult.rows[0] as AccountData;
	const balances = balancesResult.rows as BalanceData[];
	const formattedBalances: BalanceData[] = balances
		.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
		.map((balance) => ({
			...balance,
			date: new Intl.DateTimeFormat('en-GB', {
				month: 'short',
				year: 'numeric'
			}).format(new Date(balance.date)),
			amount: balance.amount ? parseFloat(balance.amount) || 0 : 0
		}));

	const diff = formattedBalances[formattedBalances.length - 1].amount - formattedBalances[0].amount;
	let diffPercent = ((diff / formattedBalances[0].amount) * 100).toFixed(0);
	diffPercent = Number.isNaN(diffPercent) || diffPercent === 'Infinity' ? 'N/A' : diffPercent;
	return (
		<>
			<header className="flex gap-1">
				<div className="flex h-full flex-col gap-1">
					<Link href={`/edit/account/${id}`}>
						<Card className="flex h-12 w-12 items-center gap-1 p-1 transition-all hover:bg-blue-600 hover:text-white">
							<PencilIcon className="mx-auto h-8" />
						</Card>
					</Link>
					<Link href={'/accounts/'}>
						<Card className="flex h-20 w-12 items-center gap-1 p-1 transition-all hover:bg-blue-600 hover:text-white">
							<ChevronLeftIcon className="mx-auto h-10" />
						</Card>
					</Link>
				</div>
				<Card className="flex items-center justify-between">
					<div className="flex flex-col items-start">
						<h1 className="text-2xl font-bold">{account.name}</h1>
						<span className="text-gray-500">
							{account.parent} &bull; {account.type}
						</span>
						<div>
							{account.tags.map((tag: string, i: number) => (
								<span key={i} className="text-sm text-blue-500">
									{i !== 0 ? ', ' : ''}
									{'#' + tag}
								</span>
							))}
						</div>
					</div>
					<div>
						{bankLogos[account.parent.toUpperCase()] ? (
							<Image src={`${bankLogos[account.parent.toUpperCase()]}`} alt={account.parent} width={200} height={150} />
						) : (
							<></>
						)}
					</div>
				</Card>
			</header>
			<section className="mt-2 flex flex-col gap-4">
				<div className="flex h-fit w-full flex-wrap gap-2 md:flex-nowrap">
					<Card className="h-60 w-full md:h-[350px] md:w-2/3">
						<BalanceChart data={formattedBalances} type={account.type} />
					</Card>
					<div className="flex h-fit w-full flex-col gap-2 md:h-[350px] md:w-1/3">
						<Card className="flex h-fit w-full items-center justify-between md:h-1/3">
							<h2 className="text-xl font-bold">
								Most Recent <br />
								Balance
							</h2>
							<div className="h-full">
								<span className="text-3xl font-bold">
									{formatter.format(formattedBalances[formattedBalances.length - 1].amount) || 'N/A'}
								</span>
								<br />
								<span>{formattedBalances[formattedBalances.length - 1].date || 'N/A'}</span>
							</div>
						</Card>
						<Card className="flex h-fit w-full items-center justify-between md:h-1/3">
							<h2 className="text-xl font-bold">Difference</h2>
							<span className="text-lg">
								£{diff} {diffPercent == 'N/A' ? '' : `— ${diffPercent}%`}
							</span>
						</Card>
						<Card className="flex h-fit w-full items-center justify-between md:h-1/3">
							<h2 className="mb-2 text-xl font-bold">Starting Balance</h2>
							<div className="h-full">
								<span className="text-3xl font-bold">{formatter.format(formattedBalances[0].amount)}</span>
								<br />
								<span>{formattedBalances[0].date}</span>
							</div>
						</Card>
					</div>
				</div>
				<HistoryTable balanceData={formattedBalances} />
			</section>
		</>
	);
}
