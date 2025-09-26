import {clsx, type ClassValue} from 'clsx';
import {twMerge} from 'tailwind-merge';
import {BalanceData} from './types';

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

const formatter = new Intl.NumberFormat('en-GB', {
	style: 'currency',
	currency: 'GBP',
	trailingZeroDisplay: 'stripIfInteger'
});

export function currencyFormatter(value: number | string) {
	value = parseFloat(value.toString());
	return formatter.format(value);
}

export function formatBalances(balances: BalanceData[]): BalanceData[] {
	return balances
		.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
		.map((balance) => ({
			...balance,
			date: new Intl.DateTimeFormat('en-GB', {
				month: 'short',
				year: 'numeric'
			}).format(new Date(balance.date)),
			amount: balance.amount || 0
		}));
}
