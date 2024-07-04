import {Card, Flex, ProgressBar, Title, Text} from '@tremor/react';
import {valueFormatter} from '../../lib/functions';

export default function MyProgressBar({start, goal, curr}) {
	const networth = valueFormatter(curr);
	return (
		<div className="flex flex-col justify-between items-center w-full md:w-[40%]">
			<Title className="mb-4">Goal Progress</Title>
			<Card className="mx-auto w-full">
				<Flex>
					<Text>{valueFormatter(start)}</Text>
					<Text>
						{networth} &bull; {Math.round((curr / goal) * 100)}%
					</Text>
					<Text>{valueFormatter(goal)}</Text>
				</Flex>
				<ProgressBar value={(curr / goal) * 100} color="teal" className="mt-3" />
			</Card>
		</div>
	);
}
