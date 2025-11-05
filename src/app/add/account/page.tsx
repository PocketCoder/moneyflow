'use client';

import {Card} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {saveNewAccount} from '@/lib/server-utils';
import {banks, types} from '@/lib/data';
import {Button} from '@/components/ui/button';
import {useFormState, useFormStatus} from 'react-dom';
import {useEffect} from 'react';
import {toast} from 'sonner';
import {redirect} from 'next/navigation';

const initialState = {
	success: false,
	account_name: '',
	error: undefined
};

function SubmitButton() {
	const {pending} = useFormStatus();
	return (
		<Button type="submit" disabled={pending}>
			{pending ? 'Saving...' : 'Save Account'}
		</Button>
	);
}

export default function AddAccount() {
	const [state, formAction] = useFormState(saveNewAccount, initialState);

	useEffect(() => {
		if (state.success) {
			toast.success(`Account '${state.account_name}' created successfully`);
			redirect('/add/balance');
		} else if (state.error) {
			toast.error(state.error);
		}
	}, [state]);

	return (
		<section className="flex h-full flex-col justify-center gap-5">
			<h1 className="mb-2 scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">Add Account</h1>
			<Card className="mx-auto h-fit w-md p-4">
				<form action={formAction} className="flex flex-col gap-2">
					<Select name="bank">
						<SelectTrigger>
							<SelectValue placeholder="Bank" />
						</SelectTrigger>
						<SelectContent>
							{banks.map((bank) => (
								<SelectItem key={bank.value} value={bank.value}>
									{bank.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<Input type="text" name="account_name" placeholder="Account Name" />
					<Select name="type">
						<SelectTrigger>
							<SelectValue placeholder="Type" />
						</SelectTrigger>
						<SelectContent>
							{types.map((type) => (
								<SelectItem key={type} value={type}>
									{type}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<SubmitButton />
				</form>
			</Card>
		</section>
	);
}
