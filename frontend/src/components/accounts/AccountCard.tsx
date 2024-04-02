import {useMemo} from 'react';
import {Card, Metric, Text, Title, BadgeDelta} from '@tremor/react';
import {calcPercDiff} from '../../lib/functions';

export default function AccountCard({account}) {
	const percDiffResult = useMemo(() => {
		try {
			const balLen = account.balanceHistory.length;
			const oldestBal = account.balanceHistory[balLen - 1];
			const percDiff = calcPercDiff(oldestBal.amount, account.balance);
			return percDiff;
		} catch (e) {
			console.warn({account, e});
		}
	}, [account]);
	return (
		<Card
			className="border-x-1 border-b-2 border-b-gray-200 border-x-gray-200 hover:border-gray-200 transition-all ease-in-out cursor-pointer"
			decoration="top"
			decorationColor={account.type === 'Debt' ? 'red' : 'indigo'}>
			<Title>{account.name}</Title>
			<Text>{account.parent}</Text>
			{account.type === 'Debt' ? (
				<Metric className="text-red-600 mt-2">(£{account.balance})</Metric>
			) : (
				<Metric className=" mt-2">£{account.balance}</Metric>
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
