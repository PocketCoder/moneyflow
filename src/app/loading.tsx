import {ArrowPathIcon} from '@heroicons/react/24/outline';
export default function Loading() {
	return (
		<div className="flex h-full w-full items-center justify-center gap-2">
			<ArrowPathIcon className="text-muted-foreground w-16 animate-spin" />
			<h1 className="text-muted-foreground text-xl font-bold">Loading</h1>
		</div>
	);
}
