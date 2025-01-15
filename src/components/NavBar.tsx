'use client';
import Link from 'next/link';
import clsx from 'clsx';
import {usePathname} from 'next/navigation';
import {Squares2X2Icon, QueueListIcon, AdjustmentsVerticalIcon, PlusIcon} from '@heroicons/react/24/outline';

export default function NavBar() {
	const path = usePathname();
	return (
		<nav className="h-18 fixed bottom-0 w-screen bg-teal-500 px-4 py-2 text-white">
			<ul className="flex h-full w-full justify-evenly">
				<li className="transition duration-200 ease-in-out hover:text-blue-700">
					<Link href={'/'}>
						<Squares2X2Icon
							className={clsx('w-10 stroke-1 hover:stroke-[1.5px]', {
								'stroke-[1.5px] text-blue-700': path === '/',
								'stroke-1 text-white': path !== '/'
							})}
						/>
					</Link>
				</li>
				<li className="transition duration-200 ease-in-out hover:text-blue-700">
					<Link href={'/accounts'}>
						<QueueListIcon
							className={clsx('w-10 stroke-1 hover:stroke-[1.5px]', {
								'stroke-[1.5px] text-blue-700': path.includes('/accounts'),
								'stroke-1 text-white': !path.includes('/accounts')
							})}
						/>
					</Link>
				</li>
				<li className="transition duration-200 ease-in-out hover:text-blue-700">
					<Link href={'/add'}>
						<PlusIcon
							className={clsx('w-10 stroke-2 hover:stroke-[1.5px]', {
								'stroke-[1.5px] text-blue-700': path.includes('/add'),
								'stroke-1 text-white': !path.includes('/add')
							})}
						/>
					</Link>
				</li>
				<li className="transition duration-200 ease-in-out hover:text-blue-700">
					<Link href={'/settings'}>
						<AdjustmentsVerticalIcon
							className={clsx('w-10 stroke-1 hover:stroke-[1.5px]', {
								'stroke-[1.5px] text-blue-700': path.includes('/settings'),
								'stroke-1 text-white': !path.includes('/settings')
							})}
						/>
					</Link>
				</li>
			</ul>
		</nav>
	);
}
