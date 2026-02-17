import {UserData} from '@/lib/types';
import {sql} from '@/lib/db';
import {Card} from '@/components/Tremor/Card';
import {Input} from '@/components/Tremor/Input';
import {Button} from '@/components/Tremor/Button';
import {redirect} from 'next/navigation';
import {getCachedUser} from '@/lib/server-utils';
import {SignOut} from '@/components/auth/signout-button';
import {SignIn} from '@/components/auth/signin-button';

export default async function Settings() {
	const user = await getCachedUser();
	if (!user) redirect('/welcome');
	const userDataResult = await sql`SELECT name FROM users WHERE id = ${user.id}`;
	const userData: UserData = userDataResult[0] as UserData;
	return (
		<main className="flex flex-col gap-4">
			<Card className="flex items-center justify-between">
				<h2 className="text-lg font-bold">Name</h2>
				<div className="flex w-90 gap-4">
					<Input placeholder="Name" className="w-80" defaultValue={userData.name} />
					<Button variant="primary">Save</Button>
				</div>
			</Card>
			<div className="flex gap-4">
				{user ? (
					<>
						<SignOut />
					</>
				) : (
					<>
						<SignIn />
					</>
				)}
			</div>
		</main>
	);
}
