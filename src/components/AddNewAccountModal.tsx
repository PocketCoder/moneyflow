import {useState} from 'react';
import {TextInput, Title, Subtitle, Button, Card, SearchSelect, SearchSelectItem} from '@tremor/react';
import {
	PlusIcon,
	XMarkIcon,
	DocumentPlusIcon,
	CurrencyPoundIcon,
	BuildingLibraryIcon,
	WalletIcon
} from '@heroicons/react/24/outline';

export default function AddNewAccountModal({closeModal}) {
	const [accounts, setAccounts] = useState([{accountName: '', balance: ''}]);
	const [value, setValue] = useState('');

	const addAccount = () => {
		setAccounts([...accounts, {accountName: '', balance: ''}]);
	};

	const removeAccount = (index) => {
		const updatedAccounts = [...accounts];
		updatedAccounts.splice(index, 1);
		setAccounts(updatedAccounts);
	};

	let number = true;

	const updateAccount = (index, field, value) => {
		if (Number(value)) {
			number = false;
			return false;
		}
		const updatedAccounts = [...accounts];
		updatedAccounts[index][field] = value;
		setAccounts(updatedAccounts);
	};

	const saveAccounts = () => {
		console.log(accounts);
	};

	const banks = [
		{id: '1', name: 'Barclays'},
		{id: '2', name: 'Lloyds Bank'},
		{id: '3', name: 'HSBC'},
		{id: '4', name: 'NatWest'},
		{id: '5', name: 'Santander'},
		{id: '6', name: 'Royal Bank of Scotland'},
		{id: '7', name: 'Nationwide Building Society'},
		{id: '8', name: 'Standard Chartered'},
		{id: '9', name: 'Co-operative Bank'},
		{id: '10', name: 'Tesco Bank'},
		{id: '12', name: 'Yorkshire Bank'},
		{id: '13', name: 'First Direct'},
		{id: '14', name: 'Metro Bank'},
		{id: '15', name: 'Bank of Ireland'},
		{id: '16', name: 'Ulster Bank'},
		{id: '17', name: 'Danske Bank'},
		{id: '18', name: 'Virgin Money'},
		{id: '19', name: 'M&S Bank'},
		{id: '20', name: 'Halifax'},
		{id: '21', name: 'Skipton Building Society'},
		{id: '22', name: 'Leeds Building Society'},
		{id: '23', name: "Sainsbury's Bank"},
		{id: '25', name: 'Yorkshire Building Society'},
		{id: '26', name: 'Other'}
	];

	return (
		<div className="fixed top-0 left-0 w-full h-full flex items-center justify-center backdrop-blur-sm">
			<Card className="w-2/3 h-2/3 p-6 bg-white border">
				<Title>Add New Account</Title>
				<Subtitle>Add a new bank and any accounts you hold with them, and their balances.</Subtitle>
				<SearchSelect value={value} onValueChange={setValue}>
					{banks.map((bank, index) => (
						<SearchSelectItem key={index} value={bank.id}>
							{bank.name}
						</SearchSelectItem>
					))}
				</SearchSelect>
				{accounts.map((account, index) => (
					<div key={index} className="flex justify-between items-start my-2">
						<TextInput
							type="text"
							placeholder="Account Name..."
							className="w-8/12"
							value={account.accountName}
							icon={WalletIcon}
							onChange={(e) => updateAccount(index, 'accountName', e.target.value)}
						/>
						<TextInput
							type="text"
							placeholder="Balance..."
							className="w-1/12"
							value={account.balance}
							icon={CurrencyPoundIcon}
							onChange={(e) => updateAccount(index, 'balance', e.target.value)}
						/>
						<Button icon={XMarkIcon} size="sm" color="red" onClick={() => removeAccount(index)}></Button>
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
