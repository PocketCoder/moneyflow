import {Button} from '@tremor/react';
import {Dialog, DialogPanel} from '@tremor/react';
import {XMarkIcon} from '@heroicons/react/24/outline';

export default function AddMenu({menuState, toggleMenu, updateAllModal, addNewAccountModal}) {
	return (
		<Dialog open={menuState} onClose={toggleMenu} static={true}>
			<DialogPanel className="fixed right-10 w-fit">
				<div className="flex flex-col justify-evenly items-end">
					<Button
						className="my-4"
						onClick={() => {
							addNewAccountModal();
							toggleMenu();
						}}>
						Add New Account
					</Button>
					<Button
						className="my-4"
						onClick={() => {
							updateAllModal();
							toggleMenu();
						}}>
						Update All
					</Button>
				</div>
				<div className="flex flex-col justify-evenly items-end">
					<Button className="my-4" icon={XMarkIcon} size="xs" variant="secondary" color="red" onClick={toggleMenu}>
						Close
					</Button>
				</div>
			</DialogPanel>
		</Dialog>
	);
}
