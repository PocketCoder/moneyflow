import type {AccountData, BalanceData} from '@/lib/types';
import {sql} from '@vercel/postgres';
import {Card} from '@/components/Tremor/Card';
import BalanceChart from '@/components/BalanceChart';

export default async function Home() {
	const accountResult = await sql`SELECT * FROM accounts WHERE owner=${process.env.USERID} AND name='Net Worth'`;
	const account = accountResult.rows[0] as AccountData;
	const balancesResult = await sql`SELECT amount, date FROM balances WHERE account = ${account.id}`;
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
		<main>
			<Card className="w-full md:w-2/3 h-60 md:h-[350px]">
				<BalanceChart data={formattedBalances} type={account.type} />
			</Card>
		</main>
	);
}
