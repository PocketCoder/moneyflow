import {Card, Title, Text, Metric, Subtitle} from '@tremor/react';

export default function Finish({accounts, netWorth, goal}) {
	return (
		<div className="w-full h-full">
			<h2 className="text-3xl mb-2">Finish</h2>
			<p>Here's what we've set up.</p>
			<div className="flex justify-start items-center my-6">
				<Card className="w-fit">
					<Title>Net Worth:</Title>
					<Metric>£{netWorth}</Metric>
				</Card>
				<Card className="w-fit ml-4">
					<Title>Goal:</Title>
					<Metric>£{goal}</Metric>
				</Card>
			</div>
			<div className="w-3/4 flex justify-start items-start">
				{accounts.map((e, i) => (
					<Card key={`${e.name}_${i}`} className="my-1 mx-.5 md:m-1 w-96 flex justify-between items-center">
						<div>
							<Title>{e.name}</Title>
							<Text>{e.type}</Text>
							<Subtitle>{e.bank}</Subtitle>
						</div>
						<div>
							<Text>Balance</Text>
							<Metric>£{e.balance}</Metric>
						</div>
					</Card>
				))}
			</div>
		</div>
	);
}
