import {useContext, useMemo} from 'react';
import {Title, Metric, Button} from '@tremor/react';
import {ChevronDoubleRightIcon} from '@heroicons/react/24/outline';
import {useNavigate} from 'react-router-dom';

import UserContext from '../lib/UserContext';
import PrefContext from '../lib/PrefContext';

import ProgressBar from '../components/dashboard/ProgressBar';
import AccountMakeupDonut from '../components/dashboard/AccountMakeupDonut';
import NetWorthDonut from '../components/dashboard/NetWorthDonut';
import NetWorthChart from '../components/dashboard/NetWorthChart';

import {valueFormatter, transformNetWorthData} from '../lib/functions';

export default function Dashboard() {
	const {userData} = useContext(UserContext);
	const {preferences: prefs} = useContext(PrefContext);

	const newUser = userData.accounts.length === 0;

	const {nw, goal, start, NetWorthDonutData, touchableTotal, untouchableTotal} = useMemo(() => {
		if (newUser) return {};

		const len = userData.netWorth[prefs.year].length;
		const nw = userData.netWorth[prefs.year][len - 1].amount;
		const goal = userData.prefs.goal[prefs.year];
		const start = userData.netWorth[prefs.year][0].amount || 0;

		const NetWorthDonutData = transformNetWorthData(userData.accounts, prefs.year);
		const touchableTotal = valueFormatter(NetWorthDonutData.formattedResult[0].value);
		const untouchableTotal = valueFormatter(NetWorthDonutData.formattedResult[1].value);

		return {nw, goal, start, NetWorthDonutData, touchableTotal, untouchableTotal};
	}, [userData, prefs, newUser]);

	if (newUser) {
		const navigate = useNavigate();
		return (
			<main className="p-6 min-h-full h-full w-full mb-16">
				<h1 className="text-2xl">Dashboard</h1>
				<div className="h-full w-full flex flex-col justify-center items-center">
					<h2>No Data</h2>
					<Button
						size="lg"
						icon={ChevronDoubleRightIcon}
						iconPosition="right"
						onClick={() => {
							navigate('../onboarding/', {relative: 'path'});
						}}>
						Begin Onboarding
					</Button>
				</div>
			</main>
		);
	}

	return (
		<main className="p-6 min-h-full h-full w-full">
			<h1 className="text-2xl">Dashboard</h1>
			<div className="flex flex-wrap justify-start items-center mt-0 md:mt-4 mb-20 w-full min-h-fit">
				<div className="flex flex-col justify-start md:justify-around items-center my-0 md:my-4 w-full h-[65vh] md:h-[33vh] md:flex-row">
					<div className="flex flex-col items-center justify-around w-full md:w-1/3 h-1/4 md:h-full">
						<div className="text-center">
							<Metric>{touchableTotal}</Metric>
							<Title>Touchable Total</Title>
						</div>
					</div>
					<div className="flex flex-col items-center justify-around w-full md:w-1/3 h-1/2 md:h-full">
						<div className="h-full w-full">
							<NetWorthDonut data={NetWorthDonutData} />
							{/* 
								<Metric>{valueFormatter(nw)}</Metric>
								<Title>Total Net Worth</Title>
							*/}
						</div>
					</div>
					<div className="flex flex-col items-center justify-around w-full md:w-1/3 h-1/4 md:h-full">
						<div className="text-center">
							<Metric>{untouchableTotal}</Metric>
							<Title>Untouchable Total</Title>
						</div>
					</div>
				</div>
				<div className="flex flex-col my-4 mx-auto w-full md:w-10/12 h-auto">
					<NetWorthChart />
				</div>
				<div className="flex flex-col justify-evenly items-center my-4 w-full h-[50vh] md:flex-row">
					<ProgressBar start={start} goal={goal} curr={nw} />
					<AccountMakeupDonut data={userData.accounts} year={prefs.year} />
				</div>
			</div>
		</main>
	);
}
