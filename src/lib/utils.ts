import {clsx, type ClassValue} from 'clsx';
import {twMerge} from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const cx = clsx;

export const focusRing = [
	'outline-none',
	'focus:ring-2',
	'focus:ring-offset-2',
	'focus:ring-blue-500',
	'dark:focus:ring-offset-gray-900'
];

export const focusInput = [
	'outline-none',
	'focus:ring-2',
	'focus:ring-offset-0',
	'focus:ring-blue-500',
	'dark:focus:ring-offset-gray-900'
];

export const hasErrorInput = ['ring-2', 'ring-red-500'];
