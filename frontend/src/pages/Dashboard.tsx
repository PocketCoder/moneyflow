import {useContext} from 'react';
import UserContext from '../lib/UserContext';
import {valueFormatter} from '../lib/functions';
import ProgressBar from '../components/dashboard/ProgressBar';
import {Title, Metric, LineChart, Card} from '@tremor/react';
import {formatDate} from '../lib/functions';

export default function Dashboard() {
	const {userData} = useContext(UserContext);
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
						<Metric>{valueFormatter(userData.netWorth)}</Metric>
						<Title>Total Net Worth</Title>
					</div>
					<div>
						<Metric>£XX,XXX</Metric>
						<Title>Touchable Total</Title>
					</div>
				</div>
				{userData.accounts ? <ProgressBar start={25000} goal={40000} curr={userData.netWorth} /> : <p>Loading...</p>}
				<Card className="w-fit">
					<Title>TO DO:</Title>
					- Add in Line Chart for Net Worth History. <br />
					- Add in breakdown by category. <br />- Filters for years (eventually.)
				</Card>
				{/*netWorthAcc ? <LineChart data={netWorthAcc.balanceHistory.reverse()} valueFormatter={valueFormatter} index={'date'} categories={['balance']} colors={['emerald']} /> : <p>Loading...</p>*/}
			</div>
		</main>
	);
}
