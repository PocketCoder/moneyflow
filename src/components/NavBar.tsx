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
		<nav className="border-border bg-primary text-primary-foreground fixed bottom-0 h-18 w-screen border-t px-4 py-2">
			<ul className="flex h-full w-full justify-evenly">
				<li className="hover:text-accent transition duration-200 ease-in-out">
					<Link href={'/'}>
						<Squares2X2Icon
							className={clsx('w-10 stroke-1 hover:stroke-[1.5px]', {
								'text-accent stroke-[1.5px]': path === '/',
								'text-primary-foreground/70 stroke-1': path !== '/'
							})}
						/>
					</Link>
				</li>
				<li className="hover:text-accent transition duration-200 ease-in-out">
					<Link href={'/accounts'}>
						<QueueListIcon
							className={clsx('w-10 stroke-1 hover:stroke-[1.5px]', {
								'text-accent stroke-[1.5px]': path.includes('/accounts'),
								'text-primary-foreground/70 stroke-1': !path.includes('/accounts')
							})}
						/>
					</Link>
				</li>
				<li className="hover:text-accent transition duration-200 ease-in-out">
					<Popover>
						<PopoverTrigger asChild>
							<PlusIcon
								className={clsx('w-10 cursor-pointer stroke-2 hover:stroke-[1.5px]', {
									'text-accent stroke-[1.5px]': path.includes('/add'),
									'text-primary-foreground/70 stroke-1': !path.includes('/add')
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
				<li className="hover:text-accent transition duration-200 ease-in-out">
					<Link href={'/settings'}>
						<AdjustmentsVerticalIcon
							className={clsx('w-10 stroke-1 hover:stroke-[1.5px]', {
								'text-accent stroke-[1.5px]': path.includes('/settings'),
								'text-primary-foreground/70 stroke-1': !path.includes('/settings')
							})}
						/>
					</Link>
				</li>
			</ul>
		</nav>
	);
}
