import {useState, useContext} from 'react';
import UserContext from '../lib/UserContext';
import BankRows from '../components/accounts/BankRows';
import AccountModal from '../components/accounts/AccountModal';

export default function Accounts() {
	const {userData} = useContext(UserContext);
	const [isOpen, setIsOpen] = useState(false);
	const [selectedAccount, setSelectedAccount] = useState(null);

	const openModal = (account) => {
		setSelectedAccount(account);
		setIsOpen(true);
	};
	return (
		<main className="p-6 h-full w-full">
			{isOpen && <AccountModal isOpen={isOpen} setIsOpen={setIsOpen} account={selectedAccount} />}
			<h1 className="text-2xl">Accounts</h1>
			<div className="flex-row justify-start items-center mt-4">
				{userData.accounts ? (
					<BankRows banks={userData.banks} accounts={userData.accounts} openModal={openModal} />
				) : (
					<p>Loading...</p>
				)}
			</div>
		</main>
	);
}
