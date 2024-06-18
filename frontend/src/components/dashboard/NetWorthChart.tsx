import {useContext} from 'react';
import UserContext from '../../lib/UserContext';
import PrefContext from '../../lib/PrefContext';

import {Title, Subtitle, LineChart} from '@tremor/react';
import {valueFormatter, dateFormatter} from '../../lib/functions';

export default function NetWorthChart() {
	const {userData} = useContext(UserContext);
	const {preferences} = useContext(PrefContext);

	const chartData = userData.netWorth[preferences.year];
	chartData.sort((a, b) => new Date(a.date) - new Date(b.date));

	const formattedData = chartData.map((item) => ({
		...item,
		date: dateFormatter(item.date)
	}));

	const customTooltip = (props) => {
		const {payload, active} = props;
		if (!active || !payload) return null;
		return (
			<div className="w-56 rounded-tremor-default border border-tremor-border bg-tremor-background p-2 text-tremor-default shadow-tremor-dropdown">
				{payload.map((category, idx) => (
					<div key={idx} className="flex flex-1 space-x-2.5">
						<div className={`flex w-1 flex-col bg-${category.color}-500 rounded`} />
						<div className="space-y-1">
							<p className="text-tremor-content">{category.dataKey}</p>
							<p className="font-medium text-tremor-content-emphasis">{valueFormatter(category.value)}</p>
						</div>
					</div>
				))}
			</div>
		);
	};

	return (
		<>
			<Title>Net Worth Over Time</Title>
			<Subtitle>{preferences.year}</Subtitle>
			<LineChart
				data={formattedData}
				index="date"
				categories={['amount']}
				colors={['emerald']}
				valueFormatter={valueFormatter}
				showAnimation={true}
				autoMinValue={true}
				yAxisWidth={90}
				maxValue={40000}
				customTooltip={customTooltip}
			/>
		</>
	);
}
