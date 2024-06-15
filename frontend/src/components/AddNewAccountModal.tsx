import {useState, useContext} from 'react';
import {TextInput, Title, Subtitle, Button, Card, Select, SelectItem, Divider} from '@tremor/react';
import {
	PlusIcon,
	XMarkIcon,
	DocumentPlusIcon,
	CurrencyPoundIcon,
	WalletIcon,
	BuildingLibraryIcon
} from '@heroicons/react/24/outline';
import {addNewAccounts} from '../lib/functions';
import {useAuth0} from '@auth0/auth0-react';
import UserContext from '../lib/UserContext';
import {toast} from 'react-toastify';

export default function AddNewAccountModal({closeModal}) {
	const {userData} = useContext(UserContext);
	const {getAccessTokenSilently, loginWithRedirect} = useAuth0();
	const [accounts, setAccounts] = useState([{parent: '', name: '', type: '', balance: ''}]);

	const addAccount = () => {
		setAccounts([...accounts, {parent: '', name: '', type: '', balance: ''}]);
	};

	const removeAccount = (index) => {
		const updatedAccounts = [...accounts];
		updatedAccounts.splice(index, 1);
		setAccounts(updatedAccounts);
	};

	const updateAccount = (index, field, value) => {
		const updatedAccounts = [...accounts];
		updatedAccounts[index][field] = value;
		setAccounts(updatedAccounts);
	};

	const saveAccounts = async () => {
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
		}
		let token;
		try {
			toast('Creating...');
			token = await getAccessTokenSilently();
			const result = await addNewAccounts(accounts, userData, token);
			if (result?.success) {
				toast.success('Account Added');
				closeModal();
			}
		} catch (e) {
			console.error(`Token Failed: ${e}`);
			await loginWithRedirect({
				appState: {
					returnTo: '/dashboard'
				}
			});
		}
	};

	return (
		<div className="fixed top-0 left-0 w-full h-full flex items-center justify-center backdrop-blur-sm">
			<Card className="w-2/3 h-2/3 p-6 bg-white border">
				<Title>Add New Account</Title>
				<Subtitle>Add a new bank and any accounts you hold with them, and their balances.</Subtitle>
				{accounts.map((account, index) => (
					<div key={index} className="w-full mt-4 mb-1">
						<div className="flex justify-between items-start w-full">
							<div className="w-2/5">
								<TextInput
									type="text"
									placeholder="Bank Name..."
									className="w-full"
									value={account.parent}
									icon={BuildingLibraryIcon}
									onChange={(e) => updateAccount(index, 'parent', e.target.value)}
								/>
								<TextInput
									type="text"
									placeholder="Account Name..."
									className="w-full mt-1"
									value={account.name}
									icon={WalletIcon}
									onChange={(e) => updateAccount(index, 'name', e.target.value)}
								/>
							</div>
							<div className="w-2/5 ml-2">
								<Select
									onValueChange={(e) => updateAccount(index, 'type', e)}
									className="w-full"
									placeholder="Account type...">
									<SelectItem value="Current Account">Current Account</SelectItem>
									<SelectItem value="Savings Account">Savings Account</SelectItem>
									<SelectItem value="S&S ISA">S&S ISA</SelectItem>
									<SelectItem value="Cash Lifetime ISA">Cash Lifetime ISA</SelectItem>
									<SelectItem value="S&S Lifetime ISA">S&S Lifetime ISA</SelectItem>
									<SelectItem value="Cash ISA">Cash ISA</SelectItem>
									<SelectItem value="Junior ISA">Junior ISA</SelectItem>
									<SelectItem value="Joint Account">Joint Account</SelectItem>
									<SelectItem value="Student Account">Student Account</SelectItem>
									<SelectItem value="Debt">Debt</SelectItem>
									<SelectItem value="Pension">Pension</SelectItem>
									<SelectItem value="Net Worth">Net Worth</SelectItem>
									<SelectItem value="Other">Other</SelectItem>
								</Select>
								<TextInput
									type="text"
									placeholder="Balance... (default:  £0)"
									className="w-full mt-1"
									value={account.balance}
									icon={CurrencyPoundIcon}
									onChange={(e) => updateAccount(index, 'balance', e.target.value)}
								/>
							</div>
							<div className="w-1/6">
								<Button icon={XMarkIcon} size="sm" color="red" onClick={() => removeAccount(index)}></Button>
							</div>
						</div>
						<Divider />
					</div>
				))}
				<Button className="mt-2" icon={PlusIcon} size="sm" onClick={addAccount}>
					Add Bank Account
				</Button>
				<div className="w-full h-fit flex justify-end items-end my-4">
					<Button className="mr-2" icon={XMarkIcon} size="xs" variant="secondary" color="red" onClick={closeModal}>
						Close
					</Button>
					<Button icon={DocumentPlusIcon} size="xs" onClick={saveAccounts}>
						Save
					</Button>
				</div>
			</Card>
		</div>
	);
}
