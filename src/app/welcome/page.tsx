import {auth} from '@/auth';
import {SignIn} from '@/components/auth/signin-button';
import WelcomeForm from '@/components/WelcomeForm';

export default async function Welcome() {
	const session = await auth();

	return (
		<section className="flex h-full w-full flex-col items-center justify-evenly">
			<h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">Welcome!</h1>
			{session ? (
				<WelcomeForm />
			) : (
				<>
					<SignIn />
				</>
			)}
		</section>
	);
}
