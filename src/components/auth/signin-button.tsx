import {signIn} from '@/auth';
import {Button} from '../ui/button';

export function SignIn() {
	return (
		<form
			action={async () => {
				'use server';
				await signIn('github', {redirectTo: '/'});
			}}>
			<Button className="cursor-pointer" type="submit" variant={'default'}>
				Sign in / Sign Up
			</Button>
		</form>
	);
}
