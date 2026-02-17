import Image from 'next/image';

export default async function Header() {
	return (
		<header className="bg-primary text-primary-foreground fixed top-0 z-50 flex h-14 w-screen items-center justify-between px-6 shadow-sm">
			<div className="flex gap-4">
				<Image src="/logo.svg" alt="logo" width={32} height={32} />
				<h2 className="text-primary-foreground text-2xl font-bold">Vantage</h2>
			</div>
		</header>
	);
}
