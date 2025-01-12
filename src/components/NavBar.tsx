'use client';
import Link from 'next/link';
import clsx from 'clsx';
import {usePathname} from 'next/navigation';
import {Squares2X2Icon, QueueListIcon, AdjustmentsVerticalIcon, PlusIcon} from '@heroicons/react/24/outline';

export default function NavBar() {
	const path = usePathname();
	return (
		<nav className="fixed bottom-0 w-screen h-18 bg-teal-500 text-white px-4 py-2">
			<ul className="w-full h-full flex justify-evenly">
				<li className="transition duration-200 ease-in-out hover:text-blue-700">
					<Link href={'/'}>
						<Squares2X2Icon
							className={clsx('w-10 stroke-1 hover:stroke-[1.5px]', {
								'text-blue-700 stroke-[1.5px]': path === '/',
								'text-white stroke-1': path !== '/'
							})}
						/>
					</Link>
				</li>
				<li className="transition duration-200 ease-in-out hover:text-blue-700">
					<Link href={'/accounts'}>
						<QueueListIcon
							className={clsx('w-10 stroke-1 hover:stroke-[1.5px]', {
								'text-blue-700 stroke-[1.5px]': path.includes('/accounts'),
								'text-white stroke-1': !path.includes('/accounts')
							})}
						/>
					</Link>
				</li>
				<li className="transition duration-200 ease-in-out hover:text-blue-700">
					<Link href={'/add'}>
						<PlusIcon
							className={clsx('w-10 stroke-2 hover:stroke-[1.5px]', {
								'text-blue-700 stroke-[1.5px]': path.includes('/add'),
								'text-white stroke-1': !path.includes('/add')
							})}
						/>
					</Link>
				</li>
				<li className="transition duration-200 ease-in-out hover:text-blue-700">
					<Link href={'/settings'}>
						<AdjustmentsVerticalIcon
							className={clsx('w-10 stroke-1 hover:stroke-[1.5px]', {
								'text-blue-700 stroke-[1.5px]': path.includes('/settings'),
								'text-white stroke-1': !path.includes('/settings')
							})}
						/>
					</Link>
				</li>
			</ul>
		</nav>
	);
}
