import {useContext} from 'react';
import UserContext from '../lib/UserContext';
import {valueFormatter} from '../lib/functions';
import ProgressBar from '../components/dashboard/ProgressBar';
import NetWorthDonut from '../components/dashboard/NetWorthDonut';
import NetWorthChart from '../components/dashboard/NetWorthChart';
import {Title, Metric} from '@tremor/react';
import PrefContext from '../lib/PrefContext';

export default function Dashboard() {
	const {userData} = useContext(UserContext);
	const {preferences} = useContext(PrefContext);
	return (
		<main className="p-6 h-full w-full mb-16">
			<h1 className="text-2xl">Dashboard</h1>
			<div className="flex flex-wrap justify-start items-center mt-4">
				<div className="flex justify-evenly items-center my-4 w-full">
					<div>
						<Metric>{valueFormatter(userData.netWorth[preferences.year])}</Metric>
						<Title>Total Net Worth</Title>
					</div>
					<div>
						<Metric>£XX,XXX</Metric>
						<Title>Touchable Total</Title>
					</div>
				</div>
				<div className="flex justify-evenly items-center my-4 w-full">
					<ProgressBar start={25000} goal={40000} curr={userData.netWorth[preferences.year]} />
					<NetWorthDonut data={userData.accounts} year={preferences.year} />
				</div>
				<div className='flex-col my-4 mx-auto w-10/12 h-auto"'>
					<NetWorthChart />
				</div>
			</div>
		</main>
	);
}
