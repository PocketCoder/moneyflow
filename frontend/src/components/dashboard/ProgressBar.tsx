import {Card, Flex, ProgressBar, Text} from '@tremor/react';
import {valueFormatter} from '../../lib/functions';

export default function MyProgressBar({start, goal, curr}) {
	const networth = valueFormatter(curr);
	console.log({start, goal, curr});
	return (
		<Card className="max-w-sm mx-auto">
			<Flex>
				<Text>{valueFormatter(start)}</Text>
				<Text>
					{networth} &bull; {Math.round((curr / goal) * 100)}%
				</Text>
				<Text>{valueFormatter(goal)}</Text>
			</Flex>
			<ProgressBar value={(curr / goal) * 100} color="teal" className="mt-3" />
		</Card>
	);
}
