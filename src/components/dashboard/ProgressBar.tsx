import {Card, Flex, ProgressBar, Text} from '@tremor/react';

export default function MyProgressBar({start, goal, curr}) {
	return (
		<Card className="max-w-sm mx-auto">
			<Flex>
				<Text>£{start}</Text>
				<Text>
					£{Math.round(curr)} &bull; {Math.round((curr / goal) * 100)}%
				</Text>
				<Text>£{goal}</Text>
			</Flex>
			<ProgressBar value={(curr / goal) * 100} color="teal" className="mt-3" />
		</Card>
	);
}
