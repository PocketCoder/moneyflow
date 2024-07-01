import {useContext} from 'react';
import {Button} from '@tremor/react';
import {PlusIcon, DocumentPlusIcon} from '@heroicons/react/24/outline';
import {useAuth0} from '@auth0/auth0-react';
import {toast} from 'react-toastify';
import {useMutation} from 'react-query';
import UserContext from '../../lib/UserContext';
import {addNewAccounts} from '../../lib/functions';
import AddNewAccountCard from '../../components/onboarding/AddNewAccountCard';

export default function Setup({accounts, setAccounts, setNW}) {
	const {userData} = useContext(UserContext);
	const {getAccessTokenSilently} = useAuth0();
	function addAccount() {
		const newAccounts = [
			...accounts,
			{
				name: '',
				parent: '',
				type: '',
				balance: 0
			}
		];
		setAccounts(newAccounts);
	}

	function removeAccount(index) {
		const updatedAccounts = [...accounts];
		updatedAccounts.splice(index, 1);
		setAccounts(updatedAccounts);
	}

	function updateAccount(index, field, value) {
		const updatedAccounts = [...accounts];
		updatedAccounts[index][field] = value;
		setAccounts(updatedAccounts);
	}

	const save = useMutation(
		async () => {
			// Run checks before...
			let netWorth = 0;
			for (const a of accounts) {
				if (a.balance == '') {
					a.balance = '0';
				} else if (Number.isNaN(parseFloat(a.balance))) {
					toast.warn(`${a.balance} is not a number (Bank: ${a.parent}; Account: ${a.name})`);
					return;
				}
				if (a.parent == '' || a.name == '' || a.type == '') {
					toast.warn(`Please fill in the blank fields.`);
					return;
				}
				a.date = new Date();
				netWorth += parseFloat(a.balance);
			}
			setNW(netWorth);
			const completeAccounts = [
				...accounts,
				{
					name: 'Net Worth',
					parent: 'Net Worth',
					date: new Date(),
					type: 'Net Worth',
					balance: netWorth
				}
			];
			const token = await getAccessTokenSilently();
			return addNewAccounts(completeAccounts, userData, token);
		},
		{
			onMutate: () => {
				toast('Creating...');
			},
			onError: (error) => {
				toast.error(`Mutation Error: ${error}`);
			},
			onSuccess: () => {
				toast.success('Account(s) Saved');
			}
		}
	);

	function saveAccounts() {
		// ...submitting to server
		save.mutate();
	}

	return (
		<div className="w-full h-full">
			<h2 className="text-3xl mb-2">Setup</h2>
			<p>
				Add in your accounts with the bank, the account name (official or your own), the type, and a starting balance.
			</p>
			<Button icon={PlusIcon} iconPosition="left" className="mt-4" onClick={addAccount}>
				Add another account
			</Button>
			<Button icon={DocumentPlusIcon} iconPosition="left" className="mt-4 ml-8" onClick={saveAccounts}>
				Save All
			</Button>
			<div className="p-4 overflow-y-scroll h-2/3">
				{accounts.map((a, i) => (
					<AddNewAccountCard key={i} index={i} account={a} rmAcc={removeAccount} updateAccount={updateAccount} />
				))}
			</div>
		</div>
	);
}
