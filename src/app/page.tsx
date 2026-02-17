import {StatCard} from '@/components/StatCard';
import {AccountType, type BalanceData} from '@/lib/types';
import {Card} from '@/components/Tremor/Card';
import BalanceChart from '@/components/BalanceChart';
import {currencyFormatter, formatBalances} from '@/lib/utils';
import {
	DistPieChartData,
	isNewUser,
	changeAllTime,
	percentChangeFY,
	MoM,
	YoY,
	getCachedUser,
	getNetWorthHistory
} from '@/lib/server-utils';
import {redirect} from 'next/navigation';
import {ChartBar} from '@/components/BarChart';

export default async function Home() {
	const user = await getCachedUser();
	if (!user || (await isNewUser())) {
		redirect('/welcome');
	}

	const balances = await getNetWorthHistory();
	const formattedBalances: BalanceData[] = formatBalances(balances);

	const [{percChangeAT, absChangeAT}, {percChangeFY, absChangeFY}, {percMoM, absMoM}, {percYoY, absYoY}, PieData] =
		await Promise.all([changeAllTime(), percentChangeFY(), MoM(), YoY(), DistPieChartData()]);

	return (
		<main className="grid h-full min-h-full w-full grid-cols-6 gap-4">
			<Card className="col-span-1 flex flex-col justify-evenly whitespace-nowrap lg:col-start-1 lg:row-start-1">
				<h2 className="text-2xl font-bold">
					{formattedBalances.length > 0
						? currencyFormatter(formattedBalances[formattedBalances.length - 1].amount)
						: '£0'}
				</h2>
				<span className="text-muted-foreground text-sm">Current Net Worth</span>
			</Card>
			<StatCard
				title="Change this FY"
				value={`${percChangeFY}%`}
				change={absChangeFY}
				changeFormatted={currencyFormatter(absChangeFY)}
			/>
			<StatCard
				title="Change all time"
				value={`${percChangeAT}%`}
				change={absChangeAT}
				changeFormatted={currencyFormatter(absChangeAT)}
			/>
			<StatCard
				title="Change from M-o-M"
				value={`${percMoM}%`}
				change={absMoM}
				changeFormatted={currencyFormatter(absMoM)}
			/>
			<StatCard
				title="Change from Y-o-Y"
				value={`${percYoY}%`}
				change={percYoY}
				changeFormatted={currencyFormatter(absYoY)}
			/>
			<Card className="flex items-center justify-center md:col-span-2 lg:col-span-4 lg:col-start-1 lg:row-span-3 lg:row-start-2">
				<BalanceChart data={formattedBalances} type={AccountType.NetWorth} />
			</Card>
			<Card className="flex items-center justify-center md:col-span-2 lg:col-span-2 lg:col-start-5 lg:row-span-3 lg:row-start-2">
				<ChartBar data={PieData} />
			</Card>
		</main>
	);
}
