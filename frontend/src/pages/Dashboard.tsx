import {useContext} from 'react';
import UserContext from '../lib/UserContext';
import {valueFormatter} from '../lib/functions';
import ProgressBar from '../components/dashboard/ProgressBar';
import {Title, Metric, LineChart, Card} from '@tremor/react';
import {formatDate} from '../lib/functions';
import PrefContext from '../lib/PrefContext';

export default function Dashboard() {
	const {userData} = useContext(UserContext);
	const {preferences} = useContext(PrefContext);
	/*
	const netWorthAcc = userData.accounts.find(obj => obj.name === "Net Worth");
	for (const a of netWorthAcc.balanceHistory) {
		a.date = formatDate(a.date);
	}*/
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
					{userData.accounts ? <ProgressBar start={25000} goal={40000} curr={userData.netWorth} /> : <p>Loading...</p>}
					<Card className="w-fit">
						<Title>TO DO:</Title>
						- Add in Line Chart for Net Worth History. <br />
					</Card>
				</div>
				{/*netWorthAcc ? <LineChart data={netWorthAcc.balanceHistory.reverse()} valueFormatter={valueFormatter} index={'date'} categories={['balance']} colors={['emerald']} /> : <p>Loading...</p>*/}
			</div>
		</main>
	);
}
