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
	const colour = type === 'Debt' ? '#b91c1c' : '#14b8a6';
	return (
		<ResponsiveContainer width={width} height={height}>
			<AreaChart data={data}>
				<Area type="monotone" dataKey="amount" stroke={colour} fill={colour} strokeWidth={1} dot={false} />
			</AreaChart>
		</ResponsiveContainer>
	);
}
