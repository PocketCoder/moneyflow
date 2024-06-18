import {Card, Flex, ProgressBar, Text} from '@tremor/react';
import {valueFormatter} from '../../lib/functions';

export default function MyProgressBar({start, goal, curr}) {
	const networth = valueFormatter(curr);
	return (
		<Card className="mx-auto w-1/3">
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
