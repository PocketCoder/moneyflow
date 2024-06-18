import clsx from 'clsx';
import {PlusIcon, Squares2X2Icon, CalendarIcon, UserIcon} from '@heroicons/react/24/solid';
import {NavLink} from 'react-router-dom';

export default function Navbar({toggleMenu}) {
	return (
		<nav className="h-16 w-full flex row fixed bottom-0 text-white">
			<ul className="bg-teal-600 flex items-center justify-around w-full h-full">
				<NavLink to="/dashboard" className={({ isActive }) => clsx({ 'text-black': isActive })}>
					<Squares2X2Icon className="w-7" />
				</NavLink>
				<NavLink to="/accounts" className={({ isActive }) => clsx({ 'text-black': isActive })}>
					<CalendarIcon className="w-7" />
				</NavLink>
				<NavLink to="/profile" className={({ isActive }) => clsx({ 'text-black': isActive })}>
					<UserIcon className="w-7" />
				</NavLink>
			</ul>
			<div
				className="cursor-pointer flex justify-center items-center fixed rounded-full h-16 w-16 right-7 bottom-20 bg-teal-300 hover:scale-110 hover:bg-teal-500 transition-all ease-in-out shadow-md hover:shadow-xl duration-300"
				onClick={toggleMenu}>
				<PlusIcon className="h-12 w-12" />
			</div>
		</nav>
	);
}
