import type {Metadata} from 'next';
import {redirect} from 'next/navigation';
import {Comfortaa} from 'next/font/google';
import {UserProfile, UserProvider} from '@auth0/nextjs-auth0/client';
import {getSession} from '@auth0/nextjs-auth0';
import './globals.css';

import NavBar from '@/components/NavBar';
import Header from '@/components/Header';

const comfortaa = Comfortaa({
	variable: '--font-Comfortaa-sans',
	subsets: ['latin']
});

export const metadata: Metadata = {
	title: 'Moneyflow',
	description: 'Simple money tracker.',
	icons: {
		icon: '/logo.png'
	}
};

export default async function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	const session = await getSession();
	const user: UserProfile | undefined = session?.user;
	if (!user) {
		redirect('/api/auth/login');
	}
	return (
		<html lang="en">
			<UserProvider>
				<body className={`${comfortaa.variable} h-screen w-screen antialiased`}>
					<Header />
					<main className="mb-20 mt-14 h-full w-full p-4">{children}</main>
					<NavBar />
				</body>
			</UserProvider>
		</html>
	);
}
