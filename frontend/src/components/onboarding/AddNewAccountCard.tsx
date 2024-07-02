import {Card, TextInput, Select, SelectItem, Button} from '@tremor/react';
import {BuildingLibraryIcon, WalletIcon, CurrencyPoundIcon, XMarkIcon} from '@heroicons/react/24/outline';

export default function AddNewAccountCard({index, account, rmAcc, updateAccount}) {
	return (
		<Card className="mt-8 mb-4 w-full md:w-4/6 flex flex-col md:flex-row justify-between items-start">
			<div className="w-full md:w-2/5">
				<TextInput
					type="text"
					placeholder="Bank Name..."
					value={account.parent}
					className="w-full mt-2 md:mt-0"
					icon={BuildingLibraryIcon}
					onValueChange={(e) => {
						updateAccount(index, 'parent', e);
					}}
				/>
				<TextInput
					type="text"
					placeholder="Account Name..."
					value={account.name}
					className="w-full mt-2 md:mt-1"
					icon={WalletIcon}
					onValueChange={(e) => {
						updateAccount(index, 'name', e);
					}}
				/>
			</div>
			<div className="w-full md:w-2/5 md:ml-2">
				<Select
					className="mt-2 md:mt-0 w-full"
					placeholder="Account type..."
					enableClear={true}
					value={account.type}
					onValueChange={(e) => {
						updateAccount(index, 'type', e);
					}}>
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
					<SelectItem value="Other">Other</SelectItem>
				</Select>
				<TextInput
					type="text"
					placeholder="Balance... (default:  £0)"
					className="w-full mt-2 md:mt-1"
					icon={CurrencyPoundIcon}
					value={account.balance}
					defaultValue="0"
					onValueChange={(e) => {
						updateAccount(index, 'balance', e);
					}}
				/>
			</div>
			<div className="mx-auto mt-2 md:mt-0 md:w-1/6">
				<Button icon={XMarkIcon} size="sm" color="red" onClick={() => rmAcc(index)}></Button>
			</div>
		</Card>
	);
}
