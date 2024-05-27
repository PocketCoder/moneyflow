import {useMemo, useContext} from 'react';
import PrefContext from '../../lib/PrefContext';
import {Card, Metric, Text, Title, BadgeDelta} from '@tremor/react';
import {calcPercDiff} from '../../lib/functions';

export default function AccountCard({account}) {
	const {preferences} = useContext(PrefContext);
	const year = preferences.year;
	const percDiffResult = useMemo(() => {
		try {
			const balLen = account.years[year].length;
			const oldestBal = account.years[year][balLen - 1];
			const percDiff = calcPercDiff(oldestBal.amount, account.balance);
			return percDiff;
		} catch (e) {
			console.warn({account, e});
		}
	}, [account]);
	const balance = account.years[year] ?  account.years[year][0].amount : 0;
	return (
		<Card
			className="border-x-1 border-b-2 border-b-gray-200 border-x-gray-200 hover:border-gray-200 transition-all ease-in-out cursor-pointer"
			decoration="top"
			decorationColor={account.type === 'Debt' ? 'red' : 'indigo'}>
			<Title>{account.name}</Title>
			<Text>{account.parent}</Text>
			{account.type === 'Debt' ? (
				<Metric className="text-red-600 mt-2">(£{balance})</Metric>
			) : (
				<Metric className=" mt-2">£{balance}</Metric>
			)}
			{!isNaN(percDiffResult) && isFinite(percDiffResult) ? (
				<BadgeDelta
					className="mt-3"
					deltaType={percDiffResult > 0 ? 'moderateIncrease' : percDiffResult < 0 ? 'moderateDecrease' : 'unchanged'}>
					{percDiffResult}%
				</BadgeDelta>
			) : (
				<></>
			)}
		</Card>
	);
}
