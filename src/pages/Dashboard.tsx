import {useState, useEffect} from 'react';
import {mergeAccountsAndBalances, sumNetWorth} from '../lib/functions';
import ProgressBar from '../components/dashboard/ProgressBar';

export default function Page() {
	const [allAccounts, setAllAccounts] = useState(null);
	useEffect(() => {
		const fetchData = async () => {
			try {
				const mergedAccounts = await mergeAccountsAndBalances();
				setAllAccounts(mergedAccounts);
			} catch (error) {
				console.error('Error fetching data:', error);
			}
		};

		fetchData();
	}, []);
	//const netWorth = sumNetWorth(allAccounts);
	return (
		<main className="p-6 h-full w-full mb-16">
			<h1 className="text-2xl">Dashboard</h1>
			<div className="flex flex-row justify-start items-center mt-4">
				{allAccounts ? <ProgressBar start={25000} goal={40000} curr={10} /> : <p>Loading...</p>}
			</div>
		</main>
	);
}
