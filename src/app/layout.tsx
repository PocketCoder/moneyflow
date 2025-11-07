import type {Metadata} from 'next';
import {SpeedInsights} from '@vercel/speed-insights/next';
import {Comfortaa} from 'next/font/google';
import './globals.css';

import {Toaster} from '@/components/ui/sonner';
import NavBar from '@/components/NavBar';
import Header from '@/components/Header';
import {Suspense} from 'react';
import Loading from '@/app/loading';

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
	return (
		<html lang="en">
			<body className={`${comfortaa.variable} flex h-screen w-screen flex-col antialiased`}>
				<Header />
				<Suspense fallback={<Loading />}>
					<main className="mt-14 mb-20 flex-grow overflow-y-auto p-4">{children}</main>
					<Toaster richColors />
				</Suspense>
				<NavBar />
				<SpeedInsights />
			</body>
		</html>
	);
}
