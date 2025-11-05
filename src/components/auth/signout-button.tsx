import {signOut} from '@/auth';
import {Button} from '../ui/button';

export function SignOut() {
	return (
		<form
			action={async () => {
				'use server';
				await signOut();
			}}>
			<Button className="cursor-pointer" type="submit" variant="secondary">
				Sign Out
			</Button>
		</form>
	);
}
