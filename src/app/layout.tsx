import type {Metadata} from 'next';
import {inter} from '@/app/ui/fonts';
import '@/app/ui/globals.css';
import NavBar from '@/app/ui/NavBar';

export const metadata: Metadata = {
	title: 'Moneyflow',
	description: 'Find out where your money comes in, and where it goes out.'
};

export default function RootLayout({children}: {children: React.ReactNode}) {
	return (
		<html lang="en">
			<body className={`${inter.className} antialiased`}>
				{children}
				<NavBar />
			</body>
		</html>
	);
}
