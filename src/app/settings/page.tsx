import {UserData} from '@/lib/types';
import {sql} from '@vercel/postgres';
import {Card} from '@/components/Tremor/Card';
import {Input} from '@/components/Tremor/Input';
import {Button} from '@/components/Tremor/Button';

export default async function Settings() {
	const userDataResult = await sql`SELECT name, preferences FROM users WHERE id=${process.env.USERID}`;
	const userData: UserData = userDataResult.rows[0] as UserData;
	// TODO: Redo Goals.
	return (
		<main className="flex flex-col gap-4">
			<Card className="flex justify-between items-center">
				<h2 className="font-bold text-lg">Name</h2>
				<div className="flex w-90 gap-4">
					<Input placeholder="Name" className="w-80" defaultValue={userData.name} />
					<Button variant="primary">Save</Button>
				</div>
			</Card>
			<Card className="flex flex-col justify-between items-between gap-2">
				<h2 className="font-bold text-lg">Goal</h2>
			</Card>
		</main>
	);
}
