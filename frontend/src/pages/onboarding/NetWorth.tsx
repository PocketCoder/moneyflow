import {useState} from 'react';
import {Card, Title, Subtitle, Text, Metric, Button} from '@tremor/react';
import {CalculatorIcon} from '@heroicons/react/24/outline';

export default function NetWorth({accounts, nw}) {
	const [reveal, setReveal] = useState(false);

	function netWorth() {
		setReveal(!reveal);
	}

	return (
		<div className="w-full h-full">
			<h2 className="text-3xl mb-2">Net Worth</h2>
			<p>Now it's time for the moment of truth. Let's see how much you're worth.</p>
			<div className="w-full flex flex-col flex-wrap pb-36 md:p-0">
				<div className="w-full py-8 px-4 flex justify-evenly">
					{reveal ? <Metric>£{nw}</Metric> : <Metric>£????</Metric>}
					<Button icon={CalculatorIcon} iconPosition="left" onClick={netWorth} disabled={reveal}>
						Calculate Net Worth
					</Button>
				</div>
				<div className="min-w-full max-w-full h-1/3 px-4 flex flex-col md:flex-row md:flex-wrap overflow-scroll">
					{accounts.map((e, i) => (
						<Card key={`${e.name}_${i}`} className="my-1 mx-.5 md:m-1 w-full md:w-96 flex justify-between items-center">
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
		</div>
	);
}
