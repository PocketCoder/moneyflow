'use client';
import {Bar, BarChart, CartesianGrid, Cell, LabelList, YAxis} from 'recharts';
import {ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent} from '@/components/ui/chart';

export function ChartBar({data}: {data: {account: string; balance: number}[]}) {
	const filteredData = data.filter((item) => item.account !== 'Net Worth');
	const chartConfig = {
		balance: {
			label: 'Balance'
		},
		...filteredData.reduce<ChartConfig>((acc, {account}, i) => {
			acc[account] = {
				label: account,
				color: `hsl(var(--chart-${i + 1}))`
			};
			return acc;
		}, {})
	} satisfies ChartConfig;

	const balances = filteredData.map(({balance}) => balance);
	const maxBalance = Math.max(0, ...balances);
	const minBalance = Math.min(0, ...balances);

	return (
		<ChartContainer config={chartConfig} className="block h-[250px] w-full">
			<BarChart accessibilityLayer data={filteredData}>
				<YAxis hide domain={[minBalance * 1.2, maxBalance * 1.2]} />
				<CartesianGrid vertical={false} />
				<ChartTooltip
					cursor={false}
					content={({payload}) => <ChartTooltipContent payload={payload} hideLabel hideIndicator />}
				/>
				<Bar dataKey="balance">
					<LabelList position="top" dataKey="account" fill="#000" fillOpacity={1} />
					{filteredData.map((item, i) => (
						<Cell key={i + item.account} fill={item.balance > 0 ? 'var(--chart-2)' : 'var(--chart-1)'} />
					))}
				</Bar>
			</BarChart>
		</ChartContainer>
	);
}
