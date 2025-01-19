import type {BalanceData} from '@/lib/types';
import {Card} from '@/components/Tremor/Card';
import BalanceChart from '@/components/BalanceChart';
import {getSession} from '@auth0/nextjs-auth0';
import {formatBalances, getBalances, getNetWorthAccount, getUserID} from '@/lib/utils';

export default async function Home() {
	const session = await getSession();
	const userID = await getUserID(session!);
	const netWorthAccount = await getNetWorthAccount(userID);
	const balances = await getBalances(netWorthAccount.id);
	const formattedBalances: BalanceData[] = formatBalances(balances);
	return (
		<main className="grid-container h-full min-h-full w-full">
			<Card className="col-span-2 row-span-3 row-start-2 flex items-center justify-center">
				<BalanceChart data={formattedBalances} type={netWorthAccount.type} />
			</Card>
		</main>
	);
}
