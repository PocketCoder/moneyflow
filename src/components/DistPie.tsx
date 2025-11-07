'use client';
import {PieChart, Pie} from 'recharts';
import {ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent} from './ui/chart';

export default function DistPie({data}: {data: {account: string; balance: number}[]}) {
	const chartConfig = {
		balance: {
			label: 'Balance'
		},
		...data.reduce<ChartConfig>((acc, {account}, i) => {
			if (account === 'Net Worth') return acc;
			acc[account] = {
				label: account,
				color: `hsl(var(--chart-${i + 1}))`
			};
			return acc;
		}, {})
	} satisfies ChartConfig;

	console.log(data);

	return (
		<ChartContainer config={chartConfig} className="block h-[250px] w-[250px]">
			<PieChart>
				<ChartTooltip cursor={false} content={({payload}) => <ChartTooltipContent payload={payload} hideLabel />} />
				<Pie data={data} dataKey="balance" nameKey="account" />
			</PieChart>
		</ChartContainer>
	);
}
