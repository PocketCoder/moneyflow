import {signIn} from '@/auth';
import {Input} from '../ui/input';
import {Button} from '../ui/button';
import {GithubIcon} from '../ui/icons/lucide-github';

export function SignIn() {
	return (
		<div className="flex flex-col gap-4">
			<form
				action={async (formData) => {
					'use server';
					await signIn('mailgun', formData);
				}}
				className="flex gap-4">
				<Input type="text" name="email" placeholder="Email" />
				<Button type="submit">Sign In with Email</Button>
			</form>
			<Button
				variant={'outline'}
				onClick={async () => {
					'use server';
					await signIn('github');
				}}>
				Sign In with <GithubIcon className="mr-2 h-4 w-4" />
			</Button>
		</div>
	);
}
