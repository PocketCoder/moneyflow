import {useContext} from 'react';
import PrefContext from '../../lib/PrefContext';
import {Card, Metric, Text, Title, BadgeDelta} from '@tremor/react';
import AccountSpark from './AccountSpark';
import {calcPercDiff} from '../../lib/functions';

export default function AccountCard({account}) {
	const {preferences} = useContext(PrefContext);
	const year = preferences.year;
	const balance = account.years[year] ? account.years[year][account.years[year].length - 1].amount : 0;
	const first = account.years[year] ? account.years[year][0].amount : 0;
	const last = account.years[year] ? account.years[year][account.years[year].length - 1].amount : 0;
	let diff;
	if (first != 0) {
		diff = calcPercDiff(first, last);
	} else {
		diff = 0;
	}
	return (
		<Card
			className="flex-col justify-between h-60 w-60 border-x-1 border-b-2 border-b-gray-200 border-x-gray-200 hover:border-gray-200 transition-all ease-in-out cursor-pointer"
			decoration="top"
			decorationColor={account.type === 'Debt' ? 'red' : 'indigo'}>
			<Title>{account.name}</Title>
			<Text>{account.parent}</Text>
			{account.type === 'Debt' ? (
				<Metric className="text-red-600 mt-2">(£{balance})</Metric>
			) : (
				<Metric className=" mt-2">£{balance}</Metric>
			)}
			<BadgeDelta
				deltaType={diff > 0 ? 'moderateIncrease' : diff < 0 ? 'moderateDecrease' : 'unchanged'}
				isIncreasePositive={true}
				size="xs"
				className="mt-2">
				{diff}%
			</BadgeDelta>
			<AccountSpark account={account} />
		</Card>
	);
}
