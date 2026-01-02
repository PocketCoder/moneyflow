import {signIn} from '@/auth';
import {Button} from '../ui/button';
import {GithubIcon} from '../ui/icons/lucide-github';

export function SignIn() {
	return (
		<div className="flex flex-col gap-4">
			<form
				action={async () => {
					'use server';
					await signIn('github');
				}}>
				<Button variant={'outline'} type="submit">
					Sign In with <GithubIcon className="mr-2 h-4 w-4" />
				</Button>
			</form>
		</div>
	);
}
