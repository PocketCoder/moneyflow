'use client';
import {calculateNetWorth, saveNewAccountAndBalance} from '@/lib/server-utils';
import {Label} from './Tremor/Label';
import {Button} from './Tremor/Button';
import {Card} from './Tremor/Card';
import {Input} from './Tremor/Input';
import {SelectNative} from './Tremor/native-select';
import {toast} from 'sonner';
import {banks, types} from '@/lib/data';
import {FormEvent, useRef, useState} from 'react';
import {redirect} from 'next/navigation';

export default function WelcomeForm() {
	const formRef = useRef<HTMLFormElement>(null);
	const [accounts, setAccounts] = useState<FormData[] | null>(null);

	async function saveAll() {
		let allToSave: FormData[] = [];
		if (formRef.current) {
			const currentData = new FormData(formRef.current);
			allToSave.push(currentData);
		}
		if (!accounts) {
			toast.error('No accounts to save.');
			return;
		}
		allToSave.push(...accounts);
		allToSave.map((account) => {
			toast.promise(saveNewAccountAndBalance(account), {
				loading: 'Saving...',
				success: (data) => {
					return `${data.account_name} has been added.`;
				},
				error: (data) => {
					return `Error: ${data.error}`;
				}
			});
		});
		toast.promise(calculateNetWorth, {
			loading: 'Calculating net worth...',
			success: () => {
				return `Success! Redirecting...`;
			},
			error: (data) => {
				return `Error: ${data.error}.`;
			}
		});
		redirect('/');
	}

	function remove(index: number): void {
		setAccounts((prevAccounts) => prevAccounts!.filter((_, i) => i !== index));
	}

	function addAnother(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const data = new FormData(event.currentTarget);
		setAccounts((prevAccounts) => [...(prevAccounts || []), data]);
		formRef.current?.reset();
	}

	return (
		<div className="flex justify-around">
			<Card className="max-w-lg">
				<h2 className="text-center text-xl font-bold">Add your first account</h2>
				<form ref={formRef} onSubmit={addAnother}>
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
					<div className="flex justify-between">
						<Button variant="secondary" type="submit">
							Add another
						</Button>
						<Button variant="primary" onClick={saveAll}>
							Submit
						</Button>
					</div>
				</form>
			</Card>
			{accounts?.length !== 0 ? (
				<div className="flex max-h-screen flex-col items-center justify-center overflow-y-scroll">
					{accounts?.map((account, i) => (
						<Card key={i} className="flex w-sm flex-col">
							<span className="font-bold">{String(account.get('account_name'))}</span>
							<span className="">{String(account.get('bank'))}</span>
							<span className="">{String(account.get('type'))}</span>
							<span className="">{String(account.get('date'))}</span>
							<span className="">{String(account.get('balance'))}</span>{' '}
							<Button variant="destructive" onClick={() => remove(i)}>
								Remove
							</Button>
						</Card>
					))}
				</div>
			) : (
				<></>
			)}
		</div>
	);
}
