import Link from 'next/link';
import Image from 'next/image';
import {Button} from '@/components/Tremor/Button';
import {SignOut} from './auth/signout-button';
import {SignIn} from './auth/signin-button';
import {auth} from '@/auth';

export default async function Header() {
	const session = await auth();
	const user = session?.user;
	return (
		<header className="bg-primary text-primary-foreground fixed top-0 z-50 flex h-14 w-screen items-center justify-between px-6 shadow-sm">
			<div className="flex gap-4">
				<Image src="/logo.png" alt="logo" width={32} height={32} />
				<h2 className="text-primary-foreground text-2xl font-bold">Moneyflow</h2>
			</div>
			<div className="flex gap-4">
				{user ? (
					<>
						<Link href="/settings">
							<Button variant="secondary">User</Button>
						</Link>
						<SignOut />
					</>
				) : (
					<>
						<SignIn />
					</>
				)}
			</div>
		</header>
	);
}
