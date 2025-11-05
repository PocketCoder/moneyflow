import {UserData} from '@/lib/types';
import {sql} from '@/lib/db';
import {Card} from '@/components/Tremor/Card';
import {Input} from '@/components/Tremor/Input';
import {Button} from '@/components/Tremor/Button';
import {calculateNetWorth} from '@/lib/server-utils';
import {auth} from '@/auth';
import {redirect} from 'next/navigation';

export default async function Settings() {
	const session = await auth();
	if (!session) redirect('/welcome');
	const userDataResult = await sql`SELECT name, preferences FROM users WHERE email = ${session?.user?.email}`;
	const userData: UserData = userDataResult[0] as UserData;
	// TODO: Redo Goals.
	return (
		<main className="flex flex-col gap-4">
			<Card className="flex items-center justify-between">
				<h2 className="text-lg font-bold">Name</h2>
				<div className="flex w-90 gap-4">
					<Input placeholder="Name" className="w-80" defaultValue={userData.name} />
					<Button variant="primary">Save</Button>
				</div>
			</Card>
			<Card className="flex items-center justify-between">
				<div className="flex flex-col gap-2">
					<h2 className="text-lg font-bold">Recalculate Net Worth</h2>
					<p className="text-sm text-gray-500">
						This will recalculate your net worth based on your current balances. This may take a few seconds.
					</p>
				</div>
				{/* TODO: Add in sonner */}
				<form action={calculateNetWorth}>
					<Button variant="secondary">Recalculate</Button>
				</form>
			</Card>
		</main>
	);
}
