import {UserData} from '@/lib/types';
import {sql} from '@/lib/db';
import {Card} from '@/components/Tremor/Card';
import {Input} from '@/components/Tremor/Input';
import {Button} from '@/components/Tremor/Button';
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
		</main>
	);
}
