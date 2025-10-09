import type {BalanceData} from '@/lib/types';
import {Card} from '@/components/Tremor/Card';
import BalanceChart from '@/components/BalanceChart';
import {currencyFormatter, formatBalances} from '@/lib/utils';
import {DistPieChartData, getBalances, isNewUser, changeAllTime, percentChangeFY, MoM, YoY} from '@/lib/server-utils';
import {getNetWorthAccount} from '@/lib/server-utils';
import {auth} from '@/auth';
import {redirect} from 'next/navigation';
import DistPie from '@/components/DistPie';
import {ChartBar} from '@/components/BarChart';

export default async function Home() {
	const session = await auth();
	if (!session || (await isNewUser())) {
		redirect('/welcome');
	}

	const netWorthAccount = await getNetWorthAccount();
	const balances = await getBalances(netWorthAccount.id);
	const formattedBalances: BalanceData[] = formatBalances(balances);

	const {percChangeAT, absChangeAT} = await changeAllTime();
	const {percChangeFY, absChangeFY} = await percentChangeFY();
	const {percMoM, absMoM} = await MoM();
	const {percYoY, absYoY} = await YoY();

	const PieData = await DistPieChartData();

	return (
		<main className="grid-container h-full min-h-full w-full">
			<Card className="col-span-4 col-start-1 row-span-3 row-start-2 flex items-center justify-center">
				<BalanceChart data={formattedBalances} type={netWorthAccount.type} />
			</Card>
			<Card className="col-span-2 col-start-5 row-span-3 row-start-2 flex items-center justify-center">
				<ChartBar data={PieData} />
			</Card>
			<Card className="col-span-1 col-start-1 row-span-1 row-start-1 flex flex-col justify-evenly">
				<h2 className="text-2xl font-bold">
					{currencyFormatter(formattedBalances[formattedBalances.length - 1].amount)}
				</h2>
				<span className="text-sm whitespace-nowrap text-gray-500">Current Net Worth</span>
			</Card>
			<Card className="col-span-1 col-start-2 row-span-1 row-start-1 flex flex-col justify-evenly">
				<div className="flex gap-3">
					<h2 className="text-2xl font-bold">{percChangeFY}%</h2>
					<span className="text-2xl font-bold">|</span>
					<h2 className="text-2xl font-bold">{currencyFormatter(absChangeFY)}</h2>
				</div>
				<span className="text-sm whitespace-nowrap text-gray-500">Change this FY</span>
			</Card>
			<Card className="col-span-1 col-start-3 row-span-1 row-start-1 flex flex-col justify-evenly">
				<div className="flex gap-3">
					<h2 className="text-2xl font-bold">{percChangeAT}%</h2>
					<span className="text-2xl font-bold">|</span>
					<h2 className="text-2xl font-bold">{currencyFormatter(absChangeAT)}</h2>
				</div>
				<span className="text-sm whitespace-nowrap text-gray-500">Change all time</span>
			</Card>
			<Card className="col-span-1 col-start-4 row-span-1 row-start-1 flex flex-col justify-evenly">
				<div className="flex gap-3">
					<h2 className="text-2xl font-bold">{percMoM}%</h2>
					<span className="text-2xl font-bold">|</span>
					<h2 className="text-2xl font-bold">{currencyFormatter(absMoM)}</h2>
				</div>
				<span className="text-sm whitespace-nowrap text-gray-500">Change from M-o-M</span>
			</Card>
			<Card className="col-span-1 col-start-5 row-span-1 row-start-1 flex flex-col justify-evenly">
				<div className="flex gap-3">
					<h2 className="text-2xl font-bold">{percYoY}%</h2>
					<span className="text-2xl font-bold">|</span>
					<h2 className="text-2xl font-bold">{currencyFormatter(absYoY)}</h2>
				</div>
				<span className="text-sm whitespace-nowrap text-gray-500">Change from Y-o-Y</span>
			</Card>
		</main>
	);
}
