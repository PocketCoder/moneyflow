import type {Metadata} from 'next';
import {SpeedInsights} from '@vercel/speed-insights/next';
import {Analytics} from '@vercel/analytics/next';
import {Inter, Archivo_Black} from 'next/font/google';
import '../globals.css';

import {Toaster} from '@/components/ui/sonner';
import NavBar from '@/components/NavBar';
import Header from '@/components/Header';
import {Suspense} from 'react';
import Loading from '@/app/loading';

const inter = Inter({
	variable: '--font-inter',
	subsets: ['latin']
});

const archivoBlack = Archivo_Black({
	weight: '400',
	variable: '--font-archivo-black',
	subsets: ['latin']
});

export const metadata: Metadata = {
	title: 'Vantage',
	description: 'Simple money overview.',
	icons: {
		icon: '/favicon.ico'
	}
};

export default async function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`${inter.variable} ${archivoBlack.variable} flex h-screen w-screen flex-col antialiased`}>
				<Header />
				<Suspense fallback={<Loading />}>
					<main className="mt-14 mb-20 grow overflow-y-auto p-4">{children}</main>
					<Toaster richColors />
				</Suspense>
				<NavBar />
				<SpeedInsights />
				<Analytics />
			</body>
		</html>
	);
}
