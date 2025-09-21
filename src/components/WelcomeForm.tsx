'use client';
import {saveNewAccountAndBalance} from '@/lib/server-utils';
import {Label} from './Tremor/Label';
import {Button} from './Tremor/Button';
import {Card} from './Tremor/Card';
import {Input} from './Tremor/Input';
import {SelectNative} from './Tremor/native-select';
import {toast} from 'sonner';
import {banks, types} from '@/lib/data';
import {FormEvent, useRef} from 'react';

export default function WelcomeForm() {
	const formRef = useRef<HTMLFormElement>(null);
	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const data = new FormData(event.currentTarget);
		toast.promise(saveNewAccountAndBalance(data), {
			loading: 'Saving...',
			success: (data) => {
				formRef.current?.reset();
				return `${data.account_name} has been added.`;
			},
			error: (data) => {
				return `Error: ${data.error}`;
			}
		});
	}

	return (
		<Card className="mx-auto max-w-xl">
			<h2 className="text-center text-xl font-bold">Add your first account</h2>
			<form ref={formRef} onSubmit={handleSubmit}>
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
			</form>
		</Card>
	);
}
