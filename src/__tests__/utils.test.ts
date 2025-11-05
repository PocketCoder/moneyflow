import {BalanceData} from '@/lib/types';
import {currencyFormatter, getDiffPercent, formatBalances} from '@/lib/utils';

describe('currencyFormatter', () => {
	it('formats numbers into GBP currency', () => {
		expect(currencyFormatter(1000)).toBe('£1,000');
	});

	it('works with string inputs', () => {
		expect(currencyFormatter('2500.5')).toBe('£2,500.50');
	});

	it('strips trailing zeros for integers', () => {
		expect(currencyFormatter(100.0)).toBe('£100');
	});

	it('handles NAN', () => {
		expect(() => currencyFormatter(NaN)).toThrow(new Error('Not a number'));
		expect(() => currencyFormatter('abc')).toThrow(new Error('Not a number'));
	});
});

describe('getDiffPercent', () => {
	it('returns 100 when balance doubles', () => {
		const balances = [
			{id: '', account: '', amount: 100, date: '2025-01-01'},
			{id: '', account: '', amount: 200, date: '2025-01-02'}
		];
		expect(getDiffPercent(balances)).toBe('100');
	});

	it('returns -50 when balances halves', () => {
		const balances = [
			{id: '', account: '', amount: 100, date: '2025-01-01'},
			{id: '', account: '', amount: 50, date: '2025-01-02'}
		];
		expect(getDiffPercent(balances)).toBe('-50');
	});

	it('returns 0 when balances stay the same', () => {
		const balances = [
			{id: '', account: '', amount: 100, date: '2025-01-01'},
			{id: '', account: '', amount: 100, date: '2025-01-02'}
		];
		expect(getDiffPercent(balances)).toBe('0');
	});

	it('returns N/A when starting amount is 0', () => {
		const balances = [
			{id: '', account: '', amount: 0, date: '2025-01-01'},
			{id: '', account: '', amount: 200, date: '2025-01-02'}
		];
		expect(getDiffPercent(balances)).toBe('N/A');
	});

	it('returns N/A when balance array is empty', () => {
		const balances: BalanceData[] = [];
		expect(getDiffPercent(balances)).toBe('N/A');
	});

	it('returns N/A when both amounts are 0', () => {
		const balances = [
			{id: '', account: '', amount: 0, date: '2025-01-01'},
			{id: '', account: '', amount: 0, date: '2025-01-02'}
		];
		expect(getDiffPercent(balances)).toBe('N/A');
	});
});

describe('formatBalances', () => {
	it('sorts balances by date ascending', () => {
		const balances = [
			{id: '', account: '', amount: 0, date: '2025-01-01'},
			{id: '', account: '', amount: 0, date: '2025-02-01'}
		];
		const result = formatBalances(balances);
		expect(result[0].date).toBe('Jan 2025');
		expect(result[1].date).toBe('Feb 2025');
	});

	it('formats date as "Mon YYYY"', () => {
		const balances = [{id: '', account: '', amount: 100, date: '2025-05-15'}];
		const result = formatBalances(balances);

		expect(result[0].date).toBe('May 2025');
	});

	it('sets amount to 0 if missing', () => {
		const balances = [{id: '', account: '', amount: undefined as any, date: '2025-01-01'}];
		const result = formatBalances(balances);

		expect(result[0].amount).toBe(0);
	});
});
