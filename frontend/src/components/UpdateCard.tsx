import {Card, Bold, Subtitle, Text, NumberInput, BadgeDelta} from '@tremor/react';
import {CurrencyPoundIcon} from '@heroicons/react/24/outline';
import {calcPercDiff} from '../lib/functions';

export default function UpdateCard({account, newData, setNewData}) {
	if (account.name === 'Net Worth') {
		return <></>;
	}
	const sortedBals = account.balanceHistory.sort((a, b) => new Date(b.date) - new Date(a.date));
	const date = new Date(sortedBals[0].date);
	const lastUpdate = {
		amount: sortedBals[0].amount,
		date: `${date.toLocaleDateString(undefined, {
			weekday: 'short',
			year: '2-digit',
			month: 'short',
			day: '2-digit'
		})}`
	};
	const percDiff: number = newData[account.name] ? calcPercDiff(lastUpdate.amount, newData[account.name].amount) : 0;
	const updateFunc = (accountName, value) => {
		setNewData({account: accountName, parent: account.parent}, value);
	};
	return (
		<Card className="flex flex-col justify-between m-2 w-5/12">
			<div className="flex flex-row justify-between w-full h-1/3">
				<div>
					<Bold>{account.name}</Bold>
					<Subtitle>
						{account.parent} &bull; {account.type}
					</Subtitle>
					<Text>
						{account.type === 'Debt' ? '-' : ''}
						{lastUpdate.date}: £{lastUpdate.amount}
					</Text>
				</div>
				<div className="flex flex-col justify-evenly items-end">
					{!isNaN(percDiff) && isFinite(percDiff) ? (
						<BadgeDelta
							className="mt-3"
							deltaType={percDiff > 0 ? 'moderateIncrease' : percDiff < 0 ? 'moderateDecrease' : 'unchanged'}>
							{percDiff}%
						</BadgeDelta>
					) : (
						<></>
					)}
				</div>
			</div>
			<NumberInput
				icon={CurrencyPoundIcon}
				placeholder="Amount..."
				enableStepper={false}
				className="mt-2"
				onChange={(e) => updateFunc(account.name, e.target.value)}
			/>
		</Card>
	);
}
