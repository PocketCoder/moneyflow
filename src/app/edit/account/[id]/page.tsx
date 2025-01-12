import type {AccountData, BalanceData} from '@/lib/types';
import {bankLogos} from '@/lib/bankLogos';
import Link from 'next/link';
import Image from 'next/image';
import {sql} from '@vercel/postgres';
import {ChevronLeftIcon} from '@heroicons/react/24/outline';
import {CheckIcon} from '@heroicons/react/24/outline';
import {Card} from '@/components/Tremor/Card';
import {Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRoot, TableRow} from '@/components/Tremor/Table';
import {Input} from '@/components/Tremor/Input';
import {Button} from '@/components/Tremor/Button';
import {revalidatePath} from 'next/cache';

export default async function EditAccountPage({params}: {params: Promise<{id: string}>}) {
	const id = (await params).id;
	const accountResult = await sql`SELECT * FROM accounts WHERE owner=${process.env.USERID} AND id=${id}`;
	const balancesResult = await sql`SELECT * FROM balances WHERE account = ${id}`;
	const account = accountResult.rows[0] as AccountData;
	const balances = balancesResult.rows as BalanceData[];
	const formattedBalances: BalanceData[] = balances
		.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
		.map((balance) => ({
			...balance,
			date: new Date(balance.date).toISOString().split('T')[0],
			amount: balance.amount ? parseFloat(balance.amount) || 0 : 0
		}));
	async function updateAccountAndBalances(data: FormData) {
		'use server';
		const account_name = data.get('account_name') as string;
		const account_parent = data.get('account_parent') as string;
		const account_type = data.get('account_type') as string;
		const dbResult =
			await sql`UPDATE accounts SET name=${account_name}, parent=${account_parent}, type=${account_type} WHERE id=${id}`;
		Object.keys(data).forEach(async (key: string) => {
			if (key.endsWith('_amount') || key.endsWith('_date')) {
				const balance_id = key.split('_')[0];
				const balance_amount = data.get(key) as string;
				const balance_date = data.get(`${balance_id}_date`) as string;
				const dbResult =
					await sql`UPDATE balances SET amount=${balance_amount}, date=${balance_date} WHERE id=${balance_id}`;
			}
		});
		revalidatePath(`/edit/account/${id}`);
		// TODO: (Historic?) Net Worth update(?)
	}
	return (
		<>
			<form action={updateAccountAndBalances}>
				<header className="flex gap-1">
					<div className="flex flex-col gap-1 h-full">
						<Button type="submit" className="">
							<CheckIcon className="h-8 mx-auto" />
						</Button>
						<Link href={'/accounts/'}>
							<Card className="h-20 p-1 flex items-center gap-1 hover:bg-blue-600 transition-all hover:text-white">
								<ChevronLeftIcon className="h-10 mx-auto" />
							</Card>
						</Link>
					</div>
					<Card className="flex justify-between items-center">
						<div className="flex flex-col items-start gap-2">
							<Input className="text-2xl font-bold" defaultValue={account.name} type="text" name="account_name" />
							<div className="flex gap-2">
								<Input defaultValue={account.parent} type="text" name="account_parent" />
								<Input defaultValue={account.type} type="text" name="account_type" />
							</div>
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
								<Image
									src={`${bankLogos[account.parent.toUpperCase()]}`}
									alt={account.parent}
									width={200}
									height={150}
								/>
							) : (
								<></>
							)}
						</div>
					</Card>
				</header>
				<section className="mt-2 flex flex-col gap-4">
					<Card className="w-full h-fit">
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
											<TableCell>
												<Input type="date" defaultValue={balance.date || ''} name={`${balance.id}_date`} />
											</TableCell>
											<TableCell>
												<Input type="number" defaultValue={balance.amount} name={`${balance.id}_amount`} />
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</TableRoot>
					</Card>
				</section>
			</form>
		</>
	);
}
