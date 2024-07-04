import {Card, Title, Subtitle, Text, NumberInput, BadgeDelta} from '@tremor/react';
import {CurrencyPoundIcon} from '@heroicons/react/24/outline';
import {calcPercDiff} from '../lib/functions';

export default function UpdateCard({account, newData, setNewData}) {
	const currYear = new Date().getFullYear();
	if (account.name === 'Net Worth') {
		return <></>;
	}
	let lastUpdate: object;
	if (account.years[currYear]) {
		const latestBal: object = account.years[currYear][account.years[currYear].length - 1];
		lastUpdate = {
			amount: latestBal.amount,
			date: `${new Date(latestBal.date).toLocaleDateString(undefined, {
				weekday: 'short',
				year: '2-digit',
				month: 'short',
				day: '2-digit'
			})}`
		};
	} else {
		lastUpdate = {
			amount: '?',
			date: 'Not updated this year'
		};
	}
	const percDiff: number = newData[account.name] ? calcPercDiff(lastUpdate.amount, newData[account.name].amount) : 0;
	const updateFunc = (accountName, value) => {
		setNewData({account: accountName, parent: account.parent}, value);
	};
	return (
		<Card className="flex flex-col justify-between my-2 md:m-2 w-full md:w-5/12">
			<div className="flex flex-row justify-between w-full h-1/3">
				<div>
					<Title>{account.name}</Title>
					<Subtitle>
						{account.parent} &bull; {account.type}
					</Subtitle>
					<Text>
						{account.type === 'Debt' ? '-' : ''}
						{lastUpdate.date} &mdash; £{lastUpdate.amount}
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
