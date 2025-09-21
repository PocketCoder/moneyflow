import {auth} from '@/auth';
import Form from 'next/form';
import {SignIn} from '@/components/auth/signin-button';
import {Label} from '@/components/Tremor/Label';
import {Input} from '@/components/Tremor/Input';
import {Button} from '@/components/Tremor/Button';
import {SelectNative} from '@/components/Tremor/native-select';
import {saveNewAccountAndBalance} from '@/lib/server-utils';

const banks = [
	{value: 'barclays', label: 'Barclays', icon: '/bank-logos/barclays.svg'},
	{value: 'chase', label: 'Chase', icon: '/bank-logos/chase.svg'},
	{value: 'chip', label: 'Chip', icon: '/bank-logos/chip.svg'},
	{value: 'gov_uk', label: 'GOV.UK', icon: '/bank-logos/gov_uk.png'},
	{value: 'lloyds', label: 'Lloyds', icon: '/bank-logos/lloyds.svg'},
	{value: 'moneybox', label: 'Moneybox', icon: '/bank-logos/moneybox.svg'},
	{value: 'monzo', label: 'Monzo', icon: '/bank-logos/monzo.png'},
	{value: 'plum', label: 'Plum', icon: '/bank-logos/plum.svg'},
	{value: 'santander', label: 'Santander', icon: '/bank-logos/santander.svg'},
	{value: 'scottish_widows', label: 'Scottish Widows', icon: '/bank-logos/scottish_widows.svg'},
	{value: 'vanguard', label: 'Vanguard', icon: '/bank-logos/vanguard.svg'},
	{value: 'ybs', label: 'YBS', icon: '/bank-logos/ybs.svg'}
];

const types = ['ISA', 'Current Account', 'Debt', 'Pension'];

export default async function Welcome() {
	const user = await auth();
	return (
		<section>
			<h1>Welcome!</h1>
			{!user ? (
				<SignIn />
			) : (
				<>
					<h2>Add your first account</h2>
					<Form action={saveNewAccountAndBalance} className="w-2xl">
						<Label htmlFor="account_name">Account Name</Label>
						<Input type="text" name="account_name" />
						<Label htmlFor="bank">Select Bank</Label>
						<SelectNative name="bank">
							{banks.map((bank) => (
								<option key={bank.value} value={bank.value}>
									{bank.label}
								</option>
							))}
						</SelectNative>
						<Label htmlFor="type">Choose Type</Label>
						<SelectNative name="type">
							{types.map((type) => (
								<option key={type} value={type}>
									{type}
								</option>
							))}
						</SelectNative>
						<Label htmlFor="date">Choose date</Label>
						<Input type="date" name="date" defaultValue={new Date().toISOString().split('T')[0]} className="mb-2" />
						<Label htmlFor="balance">Balance</Label>
						<Input type="number" name="balance" defaultValue="0" className="mb-2" />
						<Button type="submit" variant="primary">
							Submit
						</Button>
					</Form>
				</>
			)}
		</section>
	);
}
