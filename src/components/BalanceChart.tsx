'use client';
import {Account as AccountData, BalanceData} from '@/lib/types';
import {ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip} from 'recharts';
import {currencyFormatter} from '@/lib/utils';

export default function BalanceChart({data, type}: {data: BalanceData[]; type: Partial<AccountData>['type']}) {
	const color = type === 'Debt' ? 'var(--destructive)' : 'var(--chart-1)';
	return (
		<ResponsiveContainer width={'100%'} height={'100%'}>
			<AreaChart data={data} margin={{top: 5, right: 20, bottom: 5, left: 0}}>
				<Area type="monotone" dataKey="amount" fill={color} stroke={color} fillOpacity={0.2} />
				<XAxis
					dataKey="originalDate"
					interval={'equidistantPreserveStart'}
					tickFormatter={(value) =>
						new Intl.DateTimeFormat('en-GB', {
							month: 'short',
							year: 'numeric'
						}).format(new Date(value))
					}
				/>
				<YAxis tickFormatter={currencyFormatter} width={70} />
				<Tooltip
					formatter={currencyFormatter}
					labelFormatter={(label) => new Date(label).toLocaleDateString('en-GB')}
				/>
			</AreaChart>
		</ResponsiveContainer>
	);
}
