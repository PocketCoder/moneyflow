import {auth} from '@/auth';
import WelcomeForm from '@/components/WelcomeForm';

export default async function Welcome() {
	const session = await auth();

	return (
		<section>
			<h1>Welcome!</h1>
			{session ? <WelcomeForm /> : <></>}
		</section>
	);
}
