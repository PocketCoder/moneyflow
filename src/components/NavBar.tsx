import {PlusIcon, Squares2X2Icon, CalendarIcon, UserIcon} from '@heroicons/react/24/solid';

export default function Navbar({onSelectNavItem, toggleMenu}) {
	return (
		<nav className="h-16 w-full flex row fixed bottom-0 text-white">
			<ul className="bg-teal-600 flex items-center justify-around w-10/12 h-full">
				<li onClick={() => onSelectNavItem('dashboard')} className="cursor-pointer">
					<Squares2X2Icon className="w-7" />
				</li>
				<li onClick={() => onSelectNavItem('accounts')} className="cursor-pointer">
					<CalendarIcon className="w-7" />
				</li>
				<li onClick={() => onSelectNavItem('profile')} className="cursor-pointer">
					<UserIcon className="w-7" />
				</li>
			</ul>
			<ul className="flex items-center justify-center w-2/12 h-full bg-teal-300">
				<li className="cursor-pointer" onClick={toggleMenu}>
					<PlusIcon className="h-12 w-12" />
				</li>
			</ul>
		</nav>
	);
}
