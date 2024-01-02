'use client';
import {PlusIcon, Squares2X2Icon, CalendarIcon, UserIcon} from '@heroicons/react/24/solid';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

const links = [
	{name: 'Home', href: '/dashboard', icon: Squares2X2Icon},
	{
		name: 'History',
		href: '/history',
		icon: CalendarIcon
	},
	{name: 'Profile', href: '/profile', icon: UserIcon}
];

const NavLinks = () => {
    const pathname = usePathname();
	return (
		<ul className="bg-teal-600 flex items-center justify-around w-10/12 h-full">
			{links.map((link) => {
				const LinkIcon = link.icon;
				return (
					<li className="cursor-pointer">
						<Link key={link.name} href={link.href} className={clsx({'text-black': pathname === link.href})}>
							<LinkIcon className="w-7" />
							<p className="hidden md:block">{link.name}</p>
						</Link>
					</li>
				);
			})}
		</ul>
	);
};

export default NavLinks;
