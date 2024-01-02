import {PlusIcon, Squares2X2Icon, CalendarIcon, UserIcon} from '@heroicons/react/24/solid';
import NavLinks from '@/app/nav-links';

const NavBar = () => {
	return (
		<nav className="h-16 w-full flex row fixed bottom-0 text-white">
			<ul className="bg-teal-600 flex items-center justify-around w-10/12 h-full">
				<NavLinks />
			</ul>
			<ul className="flex items-center justify-center w-2/12 h-full bg-teal-300">
				<li className="cursor-pointer">
					<PlusIcon className="h-12 w-12" />
				</li>
			</ul>
		</nav>
	);
};

export default NavBar;
