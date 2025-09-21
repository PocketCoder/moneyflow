'use client';
import Link from 'next/link';
import clsx from 'clsx';
import {usePathname} from 'next/navigation';
import {
	Squares2X2Icon,
	QueueListIcon,
	AdjustmentsVerticalIcon,
	PlusIcon,
	BuildingLibraryIcon,
	PlusCircleIcon
} from '@heroicons/react/24/outline';
import {Popover, PopoverContent, PopoverTrigger} from '@/components/Tremor/Popover';
import {Button} from '@/components/Tremor/Button';

export default function NavBar() {
	const path = usePathname();
	return (
		<nav className="fixed bottom-0 h-18 w-screen bg-teal-500 px-4 py-2 text-white">
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
					<Popover>
						<PopoverTrigger asChild>
							<PlusIcon
								className={clsx('w-10 cursor-pointer stroke-2 hover:stroke-[1.5px]', {
									'stroke-[1.5px] text-blue-700': path.includes('/add'),
									'stroke-1 text-white': !path.includes('/add')
								})}
							/>
						</PopoverTrigger>
						<PopoverContent className="flex flex-col gap-2">
							<Button className="flex justify-center gap-2">
								<PlusCircleIcon className="w-5" />
								<Link href={'/add/balance'}>Update Balances</Link>
							</Button>
							<Button className="flex justify-center gap-2">
								<BuildingLibraryIcon className="w-5" />
								<Link href={'/add/account'}>Add Account</Link>
							</Button>
						</PopoverContent>
					</Popover>
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
