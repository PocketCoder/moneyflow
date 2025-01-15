import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '@/components/Tremor/Dialog';
import {Button} from '@/components/Tremor/Button';
import {BackspaceIcon} from '@heroicons/react/24/outline';
import {MouseEvent} from 'react';
export default function DeleteButtonAndDialog({callback}: {callback: () => Promise<void>}) {
	const handleClick = async (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		await callback();
	};
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="destructive">
					<BackspaceIcon className="mx-auto h-8" />
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-lg">
				<DialogHeader>
					<DialogTitle>This is a destructive action</DialogTitle>
					<DialogDescription className="mt-1 text-sm leading-6">
						This will delete your account and all the balance history associated with it.
						<br />
						This action cannot be undone.
						<br />
						Your Net Worth will be recalculated without this account.
					</DialogDescription>
				</DialogHeader>
				<DialogFooter className="mt-6">
					<DialogClose asChild>
						<Button className="mt-2 w-full sm:mt-0 sm:w-fit" variant="secondary">
							Go back
						</Button>
					</DialogClose>
					<DialogClose asChild>
						<Button className="w-full sm:w-fit" variant="destructive" onClick={handleClick}>
							Delete
						</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
