import type {Metadata} from 'next';
import {Comfortaa} from 'next/font/google';
import {UserProvider} from '@auth0/nextjs-auth0/client';
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

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<UserProvider>
				<body className={`${comfortaa.variable} antialiased`}>
					<Header />
					<main className="mb-20 mt-14 h-full w-full p-4">{children}</main>
					<NavBar />
				</body>
			</UserProvider>
		</html>
	);
}
