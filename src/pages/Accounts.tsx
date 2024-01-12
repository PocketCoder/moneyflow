import {mergeAccountsAndBalances, getUniqueBanks} from '../lib/functions';
//import BankRows from '@/app/ui/accounts/BankRows';

export default function Accounts() {
	// const allAccounts = await mergeAccountsAndBalances();
	//const banks = getUniqueBanks(allAccounts);
	return (
		<main className="p-6 h-full w-full mb-16">
			<h1 className="text-2xl">Accounts</h1>
			<div className="flex-row justify-start items-center mt-4">
				{/*<BankRows banks={banks} accounts={allAccounts} />*/}
			</div>
		</main>
	);
}
