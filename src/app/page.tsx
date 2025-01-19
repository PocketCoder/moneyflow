import type {BalanceData} from '@/lib/types';
import {Card} from '@/components/Tremor/Card';
import BalanceChart from '@/components/BalanceChart';
import {getSession} from '@auth0/nextjs-auth0';
import {currencyFormatter, formatBalances, getBalances, getNetWorthAccount, getUserID} from '@/lib/utils';

//import {sql} from '@vercel/postgres';
//import {PieChart, Pie, Legend, Tooltip, ResponsiveContainer} from 'recharts';

export default async function Home() {
	const session = await getSession();
	const userID = await getUserID(session!);
	const netWorthAccount = await getNetWorthAccount(userID);
	const balances = await getBalances(netWorthAccount.id);
	const formattedBalances: BalanceData[] = formatBalances(balances);

	/*
	TODO: For the Pie Chart. When Recharts supports React 19.

	const allAccounts = await sql`SELECT * FROM accounts WHERE owner=${userID}`;
	const allAccountsData = allAccounts.rows as AccountData[];
	const data: {
		account: string;
		balance: number;
	}[] = [];

	for (const account of allAccountsData) {
		const balances = await getBalances(account.id);
		const formattedBalances = formatBalances(balances);
		if (formattedBalances.length > 0 && formattedBalances[formattedBalances.length - 1].date.includes('2024')) {
			console.log(account.name, formattedBalances[formattedBalances.length - 1].amount);
			data.push({account: account.name, balance: formattedBalances[formattedBalances.length - 1].amount});
		}
	}
*/
	return (
		<main className="grid-container h-full min-h-full w-full">
			<Card className="col-span-2 row-span-3 row-start-2 flex items-center justify-center">
				<BalanceChart data={formattedBalances} type={netWorthAccount.type} />
			</Card>
			<Card className="col-span-1 col-start-3 row-span-3 row-start-2 flex items-center justify-center">
				<code>Piechart goes here</code>
				{/*
				<ResponsiveContainer width="100%" height="100%">
					<PieChart width={400} height={400}>
						<Pie dataKey="balance" data={data} cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label />
						<Tooltip />
						<Legend />
					</PieChart>
				</ResponsiveContainer>*/}
			</Card>
			<Card className="col-span-1 col-start-1 row-span-1 row-start-1 flex flex-col justify-evenly">
				<h2 className="text-2xl font-bold">
					{currencyFormatter(formattedBalances[formattedBalances.length - 1].amount)}
				</h2>
				<span className="text-sm text-gray-500">Current Net Worth</span>
			</Card>
			<Card className="col-span-1 col-start-2 row-span-1 row-start-1 flex flex-col justify-evenly">
				<h2 className="text-2xl font-bold">Test %</h2>
				<span className="text-sm text-gray-500">% Change this year</span>
			</Card>
			<Card className="col-span-1 col-start-3 row-span-1 row-start-1 flex flex-col justify-evenly">
				<h2 className="text-2xl font-bold">Test %</h2>
				<span className="text-sm text-gray-500">% Change all time</span>
			</Card>
		</main>
	);
}
