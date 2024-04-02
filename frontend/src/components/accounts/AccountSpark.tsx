import {SparkAreaChart} from '@tremor/react';
import {formatDate} from '../../lib/functions';

export default function AccountSpark({account}) {
	for (const obj of account.balanceHistory) {
		obj.date = formatDate(obj.date);
	}

	return (
		<SparkAreaChart
			data={account.balanceHistory.reverse()}
			categories={['balance']}
			index={'date'}
			colors={['emerald']}
			className="h-12 w-full"
		/>
	);
}
