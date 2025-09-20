import {ArrowPathIcon} from '@heroicons/react/24/outline';
export default function Loading() {
	return (
		<div className="flex h-full w-full items-center justify-center gap-2">
			<ArrowPathIcon className="animate-spin w-16 text-gray-500" />
			<h1 className="text-xl font-bold text-gray-500">Loading</h1>
		</div>
	);
}
