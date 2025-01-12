import type {AccountData, BalanceData} from '@/lib/types';
import {bankLogos} from '@/lib/bankLogos';
import Link from 'next/link';
import Image from 'next/image';
import {sql} from '@vercel/postgres';
import {ChevronLeftIcon} from '@heroicons/react/24/outline';
import {PencilIcon} from '@heroicons/react/24/outline';
import {Card} from '@/components/Tremor/Card';
import {Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRoot, TableRow} from '@/components/Tremor/Table';
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
				<div className="flex flex-col gap-1 h-full">
					<Link href={'/edit/'}>
						<Card className="w-12 h-12 p-1 flex items-center gap-1 hover:bg-blue-600 transition-all hover:text-white">
							<PencilIcon className="h-8 mx-auto" />
						</Card>
					</Link>
					<Link href={'/accounts/'}>
						<Card className="w-12 h-20 p-1 flex items-center gap-1 hover:bg-blue-600 transition-all hover:text-white">
							<ChevronLeftIcon className="h-10 mx-auto" />
						</Card>
					</Link>
				</div>
				<Card className="flex justify-between items-center">
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
				<div className="w-full h-fit flex gap-2 flex-wrap md:flex-nowrap">
					<Card className="w-full md:w-2/3 h-60 md:h-[350px]">
						<BalanceChart data={formattedBalances} type={account.type} />
					</Card>
					<div className="w-full md:w-1/3 h-fit md:h-[350px] flex flex-col gap-2">
						<Card className="w-full h-fit md:h-1/3 flex items-center justify-between">
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
						<Card className="w-full h-fit md:h-1/3 flex items-center justify-between">
							<h2 className="text-xl font-bold">Difference</h2>
							<span className="text-lg">
								£{diff} {diffPercent == 'N/A' ? '' : `— ${diffPercent}%`}
							</span>
						</Card>
						<Card className="w-full h-fit md:h-1/3 flex items-center justify-between">
							<h2 className="text-xl font-bold mb-2">Starting Balance</h2>
							<div className="h-full">
								<span className="text-3xl font-bold">{formatter.format(formattedBalances[0].amount)}</span>
								<br />
								<span>{formattedBalances[0].date}</span>
							</div>
						</Card>
					</div>
				</div>
				<Card className="w-full md:w-1/2 h-fit">
					<h2 className="text-xl font-bold mb-2">History</h2>
					<TableRoot>
						<Table>
							<TableHead>
								<TableRow>
									<TableHeaderCell>Date</TableHeaderCell>
									<TableHeaderCell>Amount (£)</TableHeaderCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{formattedBalances.map((balance: BalanceData, i: number) => (
									<TableRow key={i}>
										<TableCell>{balance.date}</TableCell>
										<TableCell>{formatter.format(balance.amount)}</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</TableRoot>
				</Card>
			</section>
		</>
	);
}
