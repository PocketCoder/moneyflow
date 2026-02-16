'use client';

import {AreaChart, Area, ResponsiveContainer} from 'recharts';
import {Account as AccountData, BalanceData} from '@/lib/types';

export default function BalanceSpark({
	data,
	type,
	width,
	height
}: {
	data: BalanceData[];
	type: Partial<AccountData>['type'];
	width: number;
	height: number;
}) {
	const color = type === 'Debt' ? 'var(--destructive)' : 'var(--primary)';
	return (
		<ResponsiveContainer width={width} height={height}>
			<AreaChart data={data}>
				<Area
					type="monotone"
					dataKey="amount"
					stroke={color}
					fill={color}
					strokeWidth={1}
					dot={false}
					fillOpacity={0.2}
				/>
			</AreaChart>
		</ResponsiveContainer>
	);
}
