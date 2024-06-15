import {useContext} from 'react';
import PrefContext from '../../lib/PrefContext';
import {SparkAreaChart} from '@tremor/react';
import {dateFormatter} from '../../lib/functions';

export default function AccountSpark({account}) {
	const {preferences} = useContext(PrefContext);
	const year = preferences.year;
	const chartData = account.years[year];
	if (chartData == undefined) {
		return <></>;
	}
	chartData.sort((a, b) => new Date(a.date) - new Date(b.date));
	const formattedData = chartData.map((item) => ({
		...item,
		date: dateFormatter(item.date)
	}));
	return (
		<SparkAreaChart
			data={formattedData}
			categories={['amount']}
			index={'date'}
			colors={['emerald']}
			className="h-8 w-full pt-2"
		/>
	);
}
