import Link from 'next/link';
import {Squares2X2Icon, QueueListIcon, UserIcon, PlusIcon} from '@heroicons/react/24/outline';

export default function NavBar() {
	return (
		<nav className="fixed bottom-0 w-screen h-18 bg-teal-500 text-white px-4 py-2">
			<ul className="w-full h-full flex justify-evenly">
				<li className="transition duration-200 ease-in-out hover:text-blue-700">
					<Link href={'/'}>
						<Squares2X2Icon className="w-12 stroke-1 hover:stroke-[1.5px]" />
					</Link>
				</li>
				<li className="transition duration-200 ease-in-out hover:text-blue-700">
					<Link href={'/'}>
						<QueueListIcon className="w-12 stroke-1 hover:stroke-[1.5px]" />
					</Link>
				</li>
				<li className="transition duration-200 ease-in-out hover:text-blue-700">
					<Link href={'/'}>
						<PlusIcon className="w-12 stroke-2 hover:stroke-[1.5px]" />
					</Link>
				</li>
				<li className="transition duration-200 ease-in-out hover:text-blue-700">
					<Link href={'/'}>
						<UserIcon className="w-12 stroke-1 hover:stroke-[1.5px]" />
					</Link>
				</li>
			</ul>
		</nav>
	);
}
