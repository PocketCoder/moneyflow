import type {Metadata} from 'next';
import {Geist, Geist_Mono} from 'next/font/google';
import {UserProvider} from '@auth0/nextjs-auth0/client';
import './globals.css';

import NavBar from '@/components/NavBar';

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin']
});

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
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
				<body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
					{children}
					<NavBar />
				</body>
			</UserProvider>
		</html>
	);
}
