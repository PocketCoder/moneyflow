import {DonutChart, Legend} from '@tremor/react';
import {valueFormatter} from '../../lib/functions';

export default function NetWorthDonut({data}) {
	return (
		<div className="flex flex-col justify-between items-center w-full h-full">
			<DonutChart
				data={data.formattedResult}
				variant="donut"
				colors={['sky', 'violet', 'gray']}
				valueFormatter={valueFormatter}
				className="h-full text-xl md:text-3xl"
			/>
			{/*<Legend categories={chartData.unique} colors={['sky', 'violet', 'gray']} className="max-w-xs" />*/}
		</div>
	);
}
