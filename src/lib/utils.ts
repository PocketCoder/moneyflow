// Tremor Raw cx [v0.0.0]

import clsx, {type ClassValue} from 'clsx';
import {twMerge} from 'tailwind-merge';

export function cx(...args: ClassValue[]) {
	return twMerge(clsx(...args));
}

// Tremor Raw focusInput [v0.0.1]

export const focusInput = [
	// base
	'focus:ring-2',
	// ring color
	'focus:ring-blue-200 focus:dark:ring-blue-700/30',
	// border color
	'focus:border-blue-500 focus:dark:border-blue-700'
];

// Tremor Raw focusRing [v0.0.1]

export const focusRing = [
	// base
	'outline outline-offset-2 outline-0 focus-visible:outline-2',
	// outline color
	'outline-blue-500 dark:outline-blue-500'
];

// Tremor Raw hasErrorInput [v0.0.1]

export const hasErrorInput = [
	// base
	'ring-2',
	// border color
	'border-red-500 dark:border-red-700',
	// ring color
	'ring-red-200 dark:ring-red-700/30'
];

export const formatter = new Intl.NumberFormat('en-GB', {
	style: 'currency',
	currency: 'GBP',
	trailingZeroDisplay: 'stripIfInteger'
});

export const currencyFormatter = (value: number | string) => {
	value = parseFloat(value.toString());
	return formatter.format(value);
};
export function getDiffPercent(balances: BalanceData[]): number | string {
	const diff = balances[balances.length - 1].amount - balances[0].amount;
	let diffPercent = ((diff / balances[0].amount) * 100).toFixed(0);
	return (diffPercent = Number.isNaN(diffPercent) || diffPercent === 'Infinity' ? 'N/A' : diffPercent);
}
