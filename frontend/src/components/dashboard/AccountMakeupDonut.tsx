import {DonutChart, Legend} from '@tremor/react';
import {valueFormatter} from '../../lib/functions';

export default function AccountMakeupDonut({data, year}) {
	function transformData(data, year) {
		const result = {};

		// Iterate over each account
		data.forEach((account) => {
			// Check if the specified year exists in the account data
			if (account.years.hasOwnProperty(year) && account.years[year].length > 0) {
				const latestEntry = account.years[year][account.years[year].length - 1];
				const total = parseFloat(latestEntry.amount);

				if (account.name !== 'Net Worth') {
					// Aggregate the balances for each bank
					if (result.hasOwnProperty(account.parent)) {
						result[account.parent] += total;
					} else {
						result[account.parent] = total;
					}
				}
			}
		});

		// Transform the aggregated data into the desired format
		const formattedResult = Object.entries(result).map(([name, value]) => ({
			name,
			value
		}));

		let unique: Array<string> = [];
		Object.keys(result).forEach((key) => {
			unique.push(key);
		});
		return {formattedResult, unique};
	}

	const chartData = transformData(data, year);
	const colours = [
		'rose',
		'pink',
		'fuchsia',
		'purple',
		'violet',
		'indigo',
		'blue',
		'sky',
		'cyan',
		'teal',
		'emerald',
		'green',
		'lime',
		'yellow',
		'amber',
		'orange',
		'red',
		'stone',
		'neutral',
		'zinc',
		'gray',
		'slate'
	];
	const chartcolours = colours.slice(0, chartData.unique.length);
	return (
		<div className="flex flex-row justify-evenly items-center w-1/2">
			<DonutChart
				data={chartData.formattedResult}
				variant="pie"
				showAnimation={true}
				colors={chartcolours}
				valueFormatter={valueFormatter}
			/>
			<Legend categories={chartData.unique} colors={chartcolours} className="max-w-xs" />
		</div>
	);
}
