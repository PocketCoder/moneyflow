import {Button} from '@tremor/react';

export default function AddMenu({updateAllModal, addNewAccountModal}) {
	return (
		<nav className="h-full w-fit fixed bottom-16 right-0 p-8 list-none text-xl flex flex-col justify-end items-end bg-gray-100 bg-opacity-50 rounded-tl-3xl">
			<li className="my-1">
				<Button onClick={addNewAccountModal}>Add New Account</Button>
			</li>
			<li className="my-1">
				<Button onClick={updateAllModal}>Update All</Button>
			</li>
		</nav>
	);
}
