import Link from 'next/link';
import {getSession} from '@auth0/nextjs-auth0';
import {UserProfile} from '@auth0/nextjs-auth0/client';
import {Button} from '@/components/Tremor/Button';

export default async function Header() {
	const session = await getSession();
	const user: UserProfile | undefined = session?.user;
	return (
		<header className="fixed top-0 z-50 flex h-14 w-screen items-center justify-between bg-teal-500 px-6">
			<h2 className="text-2xl font-bold">Moneyflow</h2>
			<div className="flex gap-4">
				{user ? (
					<>
						<Link href="/user">
							<Button variant="secondary">User</Button>
						</Link>
						<Link href="/api/auth/logout">
							<Button variant="destructive">Logout</Button>
						</Link>
					</>
				) : (
					<>
						<Link href="/api/auth/login">
							<Button variant="primary">Login</Button>
						</Link>
					</>
				)}
			</div>
		</header>
	);
}
