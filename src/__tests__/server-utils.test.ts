import {
	saveNewAccount,
	saveNewAccountAndBalance,
	checkNetWorthRowExistsandCreate,
	saveBalance,
	getAccount,
	calculateNetWorth,
	getNetWorthAccount,
	getBalances,
	changeAllTime,
	DistPieChartData,
	isNewUser,
	percentChangeFY,
	updateBalances,
	MoM,
	YoY
} from '@/lib/server-utils';
import {auth} from '@/auth';
import {sql} from '@/lib/db';
import {revalidatePath} from 'next/cache';
import {Session} from 'next-auth';
import {Account, BalanceData} from '@/lib/types';

jest.mock('@/auth', () => ({
	auth: jest.fn()
}));

jest.mock('@/lib/db', () => ({
	sql: jest.fn()
}));

jest.mock('next/cache', () => ({
	revalidatePath: jest.fn()
}));

// Remove the module-level mock to avoid breaking other tests

const mockedAuth = jest.mocked(auth);
const mockedSql = jest.mocked(sql);
const mockedRevalidatePath = jest.mocked(revalidatePath);

describe('saveNewAccount', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	it('returns an error if not logged in', async () => {
		(mockedAuth as jest.Mock).mockResolvedValue(null);

		const data = new FormData();
		data.set('account_name', 'Test Account');
		data.set('bank', 'Test Bank');
		data.set('type', 'Checking');

		const prevState = {success: false};

		const result = await saveNewAccount(prevState, data);
		expect(result).toEqual({success: false, error: 'Not logged in'});
	});

	it('creates a new account successfully', async () => {
		(mockedAuth as jest.Mock).mockResolvedValue({
			user: {email: 'test@moneyflow.dev'}
		} as any);

		mockedSql.mockResolvedValueOnce([]); // accounts insert

		const data = new FormData();
		data.set('account_name', 'Test Account');
		data.set('bank', 'Test Bank');
		data.set('type', 'Savings');

		const prevState = {success: false};

		const result = await saveNewAccount(prevState, data);

		expect(result).toEqual({success: true, account_name: 'Test Account'});
		expect(mockedSql).toHaveBeenCalledTimes(1);
		expect(mockedRevalidatePath).toHaveBeenCalledWith('/accounts');
		expect(mockedRevalidatePath).toHaveBeenCalledWith('/');
	});

	it('returns an error if account creation fails', async () => {
		jest.spyOn(console, 'error').mockImplementation(() => {});
		(mockedAuth as jest.Mock).mockResolvedValue({user: {email: 'test@moneyflow.dev'}} as any);

		mockedSql.mockRejectedValueOnce(new Error('DB down'));

		const data = new FormData();
		data.set('account_name', 'Test Account');
		data.set('bank', 'Test Bank');
		data.set('type', 'Savings');

		const prevState = {success: false};

		const result = await saveNewAccount(prevState, data);
		expect(result).toEqual({success: false, error: 'Failed to create account.'});
	});
});

describe('saveNewAccountAndBalance', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	it('throws an error if not logged in', async () => {
		(mockedAuth as jest.Mock).mockResolvedValue(null);

		const data = new FormData();
		data.set('account_name', 'Test Account');
		data.set('bank', 'Test Bank');
		data.set('type', 'Checking');
		data.set('date', '2025-01-01');
		data.set('balance', '1000');

		await expect(saveNewAccountAndBalance(data)).rejects.toThrow('Not logged in');
	});

	it('creates a new account and balance successfully', async () => {
		(mockedAuth as jest.Mock).mockResolvedValue({
			user: {email: 'test@moneyflow.dev'}
		} as any);

		mockedSql.mockResolvedValueOnce([{id: 'account-123'}]); // accounts insert
		mockedSql.mockResolvedValueOnce([]); // balances insert
		mockedSql.mockResolvedValueOnce([{row_exists: true}]); // checkNetWorthRowExistsandCreate
		mockedSql.mockResolvedValueOnce([{id: 'net-worth-account-id'}]); // getNetWorthAccount
		mockedSql.mockResolvedValueOnce([]); // calculateNetWorth balances
		mockedSql.mockResolvedValueOnce([]); // calculateNetWorth insert

		const data = new FormData();
		data.set('account_name', 'Test Account');
		data.set('bank', 'Test Bank');
		data.set('type', 'Savings');
		data.set('date', '2025-01-01');
		data.set('balance', '1000');

		const result = await saveNewAccountAndBalance(data);

		expect(result).toEqual({success: true, account_name: 'Test Account'});
		expect(mockedRevalidatePath).toHaveBeenCalledWith('/accounts');
		expect(mockedRevalidatePath).toHaveBeenCalledWith('/');
	});

	it('throws an error if account creation fails', async () => {
		jest.spyOn(console, 'error').mockImplementation(() => {});
		(mockedAuth as jest.Mock).mockResolvedValue({user: {email: 'test@moneyflow.dev'}} as any);

		mockedSql.mockRejectedValueOnce(new Error('DB down'));

		const data = new FormData();
		data.set('account_name', 'Test Account');
		data.set('bank', 'Test Bank');
		data.set('type', 'Savings');
		data.set('date', '2025-01-01');
		data.set('balance', '1000');

		await expect(saveNewAccountAndBalance(data)).rejects.toThrow('Failed to create account.');
	});
});

describe('checkNetWorthRowExistsandCreate', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});
	it('does not INSERT if "Net Worth" account exists', async () => {
		const session = {user: {email: 'test@moneyflow.dev'}} as Session;
		(sql as unknown as jest.Mock).mockResolvedValueOnce([{row_exists: true}]);
		await checkNetWorthRowExistsandCreate(session);
		expect(sql).toHaveBeenCalledTimes(1);
	});

	it('INSERTs "Net Worth" row if missing', async () => {
		const session = {user: {email: 'test@moneyflow.dev'}} as Session;
		(sql as unknown as jest.Mock).mockResolvedValueOnce([{row_exists: false}]);
		(sql as unknown as jest.Mock).mockResolvedValueOnce([]);
		await checkNetWorthRowExistsandCreate(session);
		expect(sql).toHaveBeenCalledTimes(2);
		expect((sql as unknown as jest.Mock).mock.calls[1][0].toString()).toContain('INSERT INTO accounts');
	});

	it('throws an error if SQL fails', async () => {
		jest.spyOn(console, 'log').mockImplementation(() => {});
		const session = {user: {email: 'test@moneyflow.dev'}} as Session;

		(sql as unknown as jest.Mock).mockRejectedValueOnce(new Error('DB down'));

		await expect(checkNetWorthRowExistsandCreate(session)).rejects.toThrow('Error: Error: DB down');
	});
});

describe('saveBalance', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	it('returns success on INSERT', async () => {
		(sql as unknown as jest.Mock).mockResolvedValueOnce([]);
		const result = await saveBalance('123', '2025-01-01', '200');
		expect(sql).toHaveBeenCalledTimes(1);
		expect(result).toEqual({success: true});
	});

	it('throws error on SQL error', async () => {
		jest.spyOn(console, 'error').mockImplementation(() => {});
		(sql as unknown as jest.Mock).mockRejectedValueOnce(new Error('DB Down'));
		await expect(saveBalance('123', '2025-01-01', '200')).rejects.toThrow('Failed to save balance.');
		expect(sql).toHaveBeenCalledTimes(1);
	});

	it('throws error if missing any value', async () => {
		// @ts-expect-error Testing missing parameters
		await expect(saveBalance('123', '200')).rejects.toThrow('Missing parameters.');
		// @ts-expect-error Testing missing parameters
		await expect(saveBalance('123')).rejects.toThrow('Missing parameters.');
		// @ts-expect-error Testing missing parameters
		await expect(saveBalance()).rejects.toThrow('Missing parameters.');
		expect(sql).toHaveBeenCalledTimes(0);
	});
});

describe('getAccount', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	it('throws an error if not logged in', async () => {
		(mockedAuth as jest.Mock).mockResolvedValue(null);
		await expect(getAccount('123')).rejects.toThrow('Not logged in');
	});

	it('should return an account when found', async () => {
		const mockAccount: Account = {
			id: '123',
			owner: 'abc',
			name: 'Test Account',
			parent: 'Test Bank',
			type: 'Savings',
			tags: ['test']
		};

		(mockedAuth as jest.Mock).mockResolvedValue({user: {email: 'test@moneyflow.dev'}} as any);
		(mockedSql as jest.Mock).mockResolvedValue([mockAccount]);

		const result = await getAccount('123');

		expect(mockedSql).toHaveBeenCalledWith(expect.any(Array), 'test@moneyflow.dev', '123');
		expect(result).toEqual(mockAccount);
	});

	it('should return undefined if no account found', async () => {
		(mockedAuth as jest.Mock).mockResolvedValue({user: {email: 'test@moneyflow.dev'}} as any);
		(mockedSql as jest.Mock).mockResolvedValue([]);

		const result = await getAccount('123');
		expect(mockedSql).toHaveBeenCalledWith(expect.any(Array), 'test@moneyflow.dev', '123');
		expect(result).toEqual(undefined);
	});

	it('should throw an error if the database query fails', async () => {
		jest.spyOn(console, 'error').mockImplementation(() => {});
		const dbError = new Error('DB Error');
		(mockedAuth as jest.Mock).mockResolvedValue({user: {email: 'test@moneyflow.dev'}} as any);
		(mockedSql as jest.Mock).mockRejectedValue(dbError);
		await expect(getAccount('123')).rejects.toThrow('Error: Error: DB Error');
		expect(mockedSql).toHaveBeenCalledWith(expect.any(Array), 'test@moneyflow.dev', '123');
	});
});

describe('calculateNetWorth', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	it('throws an error if not logged in', async () => {
		(mockedAuth as jest.Mock).mockResolvedValue(null);
		await expect(calculateNetWorth()).rejects.toThrow('Not logged in');
	});

	it('should correctly calculate net worth from data over several time frames', async () => {
		(mockedAuth as jest.Mock).mockResolvedValue({user: {email: 'test@moneyflow.dev'}} as any);

		const mockDates = [{date: '2025-08-25'}, {date: '2025-09-25'}];

		// 1. calculateNetWorth: get dates
		// 2. getNetWorthAccount: checkNetWorthRowExistsandCreate (first call)
		// 3. getNetWorthAccount: get net worth account (first call)
		// 4. calculateNetWorth: get balances for first date (2025-08-25)
		// 5. calculateNetWorth: insert balance for first date
		// 6. calculateNetWorth: get balances for second date (2025-09-25)
		// 7. calculateNetWorth: insert balance for second date
		(mockedSql as jest.Mock)
			.mockResolvedValueOnce(mockDates) // 1. get dates
			.mockResolvedValueOnce([{row_exists: true}]) // 2. checkNetWorthRowExistsandCreate
			.mockResolvedValueOnce([{id: '123', name: 'Net Worth'}]) // 3. get net worth account
			.mockResolvedValueOnce([{amount: '200'}, {amount: '100'}]) // 4. balances for first date
			.mockResolvedValueOnce([]) // 5. insert balance for first date
			.mockResolvedValueOnce([{amount: '20'}, {amount: '150'}]) // 6. balances for second date
			.mockResolvedValueOnce([]); // 7. insert balance for second date

		await calculateNetWorth();

		expect(mockedSql).toHaveBeenCalledTimes(7);
		expect(mockedSql).toHaveBeenNthCalledWith(5, expect.any(Array), '123', '2025-08-25', 300, 300);
		expect(mockedSql).toHaveBeenNthCalledWith(7, expect.any(Array), '123', '2025-09-25', 170, 170);
	});

	it('should throw an error if the database query fails', async () => {
		jest.spyOn(console, 'error').mockImplementation(() => {});
		(mockedAuth as jest.Mock).mockResolvedValue({user: {email: 'test@moneyflow.dev'}} as any);
		(mockedSql as jest.Mock).mockRejectedValue(new Error('DB Error'));

		await expect(calculateNetWorth()).rejects.toThrow('Failed to calculate net worth');
	});

	it('should not run if there is no balance history', async () => {
		(mockedAuth as jest.Mock).mockResolvedValue({user: {email: 'test@moneyflow.dev'}} as any);
		(mockedSql as jest.Mock).mockResolvedValueOnce([]); // Return no dates

		await calculateNetWorth();

		// Should only be called once to get the dates
		expect(mockedSql).toHaveBeenCalledTimes(1);
	});
});

describe('getNetWorthAccount', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	it('throws an error if not logged in', async () => {
		(mockedAuth as jest.Mock).mockResolvedValue(null);
		await expect(getNetWorthAccount()).rejects.toThrow('Not logged in');
	});

	it('returns the "Net Worth" account if it exists', async () => {
		(mockedAuth as jest.Mock).mockResolvedValue({
			user: {email: 'test@moneyflow.dev'}
		});

		const mockAccount: Account = {
			id: '456',
			owner: '123',
			name: 'Net Worth',
			type: 'Net Worth',
			parent: 'Net Worth',
			tags: ['test']
		};

		(mockedSql as jest.Mock)
			.mockResolvedValueOnce([{row_exists: true}]) // For checkNetWorthRowExistsandCreate
			.mockResolvedValueOnce([mockAccount]); // For getNetWorthAccount

		const result = await getNetWorthAccount();

		expect(result).toEqual(mockAccount);
		expect(mockedSql).toHaveBeenCalledTimes(2);
	});

	it('creates and returns the "Net Worth" account if it does not exist', async () => {
		(mockedAuth as jest.Mock).mockResolvedValue({
			user: {email: 'test@moneyflow.dev'}
		});

		const mockAccount: Account = {
			id: '456',
			owner: '123',
			name: 'Net Worth',
			type: 'Net Worth',
			parent: 'Net Worth',
			tags: ['test']
		};

		(mockedSql as jest.Mock)
			.mockResolvedValueOnce([{row_exists: false}]) // For checkNetWorthRowExistsandCreate (check)
			.mockResolvedValueOnce([]) // For checkNetWorthRowExistsandCreate (insert)
			.mockResolvedValueOnce([mockAccount]); // For getNetWorthAccount

		const result = await getNetWorthAccount();

		expect(result).toEqual(mockAccount);
		expect(mockedSql).toHaveBeenCalledTimes(3);
	});
});

describe('getBalances', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	it('returns balances for a given account ID', async () => {
		const mockDbResponse = [
			{
				date: '2025-01-01',
				amount: 1000
			}
		];

		(mockedSql as jest.Mock).mockResolvedValue(mockDbResponse);

		const result = await getBalances('456');

		expect(mockedSql).toHaveBeenCalledWith(expect.any(Array), '456');
		expect(result).toEqual(mockDbResponse);
	});

	it('returns an empty array if there are no balances', async () => {
		(mockedSql as jest.Mock).mockResolvedValue([]);

		const result = await getBalances('456');

		expect(mockedSql).toHaveBeenCalledWith(expect.any(Array), '456');
		expect(result).toEqual([]);
	});

	it('throws an error if the database query fails', async () => {
		const dbError = new Error('DB Error');
		(mockedSql as jest.Mock).mockRejectedValue(dbError);

		await expect(getBalances('123')).rejects.toThrow('DB Error');
		expect(mockedSql).toHaveBeenCalledWith(expect.any(Array), '123');
	});

	it('returns an empty array if the account does not exist', async () => {
		(mockedSql as jest.Mock).mockResolvedValue([]);

		const result = await getBalances('456');

		expect(mockedSql).toHaveBeenCalledWith(expect.any(Array), '456');
		expect(result).toEqual([]);
	});
});

describe('isNewUser', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	it('throws an error if not logged in', async () => {
		(mockedAuth as jest.Mock).mockResolvedValue(null);
		await expect(isNewUser()).rejects.toThrow('Not logged in');
	});

	it('returns true if the user has no accounts', async () => {
		(mockedAuth as jest.Mock).mockResolvedValue({user: {email: 'test@moneyflow.dev'}});
		(mockedSql as jest.Mock).mockResolvedValue([]);
		const result = await isNewUser();
		expect(result).toBe(true);
	});

	it('returns false if the user has accounts', async () => {
		(mockedAuth as jest.Mock).mockResolvedValue({user: {email: 'test@moneyflow.dev'}});
		(mockedSql as jest.Mock).mockResolvedValue([
			{id: '1', name: 'Test Account', owner: '1', type: 'checking', parent: 'Test Bank', tags: []}
		]);
		const result = await isNewUser();
		expect(result).toBe(false);
	});

	it('should throw an error if the database query fails', async () => {
		jest.spyOn(console, 'error').mockImplementation(() => {});
		const dbError = new Error('DB Error');
		(mockedAuth as jest.Mock).mockResolvedValue({user: {email: 'test@moneyflow.dev'}});
		(mockedSql as jest.Mock).mockRejectedValue(dbError);
		await expect(isNewUser()).rejects.toThrow('Error: Error: DB Error');
	});
});

describe('changeAllTime', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	it('throws an error if not logged in', async () => {
		(mockedAuth as jest.Mock).mockResolvedValue(null);
		await expect(changeAllTime()).rejects.toThrow('Not logged in');
	});

	it('returns 0 for both if there is no data', async () => {
		(mockedAuth as jest.Mock).mockResolvedValue({user: {email: 'test@moneyflow.dev'}});
		(mockedSql as jest.Mock).mockResolvedValue([]);
		const result = await changeAllTime();
		expect(result).toEqual({percChangeAT: 0, absChangeAT: 0});
	});

	it('returns correct percentage and absolute change', async () => {
		(mockedAuth as jest.Mock).mockResolvedValue({user: {email: 'test@moneyflow.dev'}});
		(mockedSql as jest.Mock).mockResolvedValue([{earliest_balance: '100', latest_balance: '150'}]);
		const result = await changeAllTime();
		expect(result).toEqual({percChangeAT: 50, absChangeAT: 50});
	});

	it('should throw an error if the database query fails', async () => {
		jest.spyOn(console, 'error').mockImplementation(() => {});
		const dbError = new Error('DB Error');
		(mockedAuth as jest.Mock).mockResolvedValue({user: {email: 'test@moneyflow.dev'}});
		(mockedSql as jest.Mock).mockRejectedValue(dbError);
		await expect(changeAllTime()).rejects.toThrow('Error: Error: DB Error');
	});
});

describe('percentChangeFY', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	it('throws an error if not logged in', async () => {
		(mockedAuth as jest.Mock).mockResolvedValue(null);
		await expect(percentChangeFY()).rejects.toThrow('Not logged in');
	});

	it('returns 0 for both if there is no data', async () => {
		(mockedAuth as jest.Mock).mockResolvedValue({user: {email: 'test@moneyflow.dev'}});
		(mockedSql as jest.Mock).mockResolvedValue([]);
		const result = await percentChangeFY();
		expect(result).toEqual({percChangeFY: 0, absChangeFY: 0});
	});

	it('returns correct percentage and absolute change for the financial year', async () => {
		(mockedAuth as jest.Mock).mockResolvedValue({user: {email: 'test@moneyflow.dev'}});
		(mockedSql as jest.Mock).mockResolvedValue([{earliest_balance: '120', latest_balance: '150'}]);
		const result = await percentChangeFY();
		expect(result).toEqual({percChangeFY: 25, absChangeFY: 30});
	});

	it('should throw an error if the database query fails', async () => {
		jest.spyOn(console, 'error').mockImplementation(() => {});
		const dbError = new Error('DB Error');
		(mockedAuth as jest.Mock).mockResolvedValue({user: {email: 'test@moneyflow.dev'}});
		(mockedSql as jest.Mock).mockRejectedValue(dbError);
		await expect(percentChangeFY()).rejects.toThrow('Error: Error: DB Error');
	});
});

describe('updateBalances', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	it('throws an error if not logged in', async () => {
		(mockedAuth as jest.Mock).mockResolvedValue(null);
		const formData = new FormData();
		await expect(updateBalances(formData)).rejects.toThrow('User not logged in');
	});

	it('throws an error if no balance values are provided', async () => {
		(mockedAuth as jest.Mock).mockResolvedValue({user: {email: 'test@moneyflow.dev'}});
		const formData = new FormData();
		formData.set('date', '2025-01-01');
		await expect(updateBalances(formData)).rejects.toThrow('No balance values provided');
	});

	it('correctly updates balances and net worth', async () => {
		(mockedAuth as jest.Mock).mockResolvedValue({user: {email: 'test@moneyflow.dev'}});
		(mockedSql as jest.Mock)
			.mockResolvedValueOnce([]) // Mock the first balance update
			.mockResolvedValueOnce([]) // Mock the second balance update
			.mockResolvedValueOnce([{row_exists: true}]) // Mock checkNetWorthRowExistsandCreate
			.mockResolvedValueOnce([{id: 'net-worth-account-id'}]) // Mock getNetWorthAccount
			.mockResolvedValueOnce([{amount: '100'}, {amount: '200'}]) // Mock calculateNetWorth balances
			.mockResolvedValueOnce([]); // Mock calculateNetWorth insert

		const formData = new FormData();
		formData.set('date', '2025-01-01');
		formData.set('amount-1', '100');
		formData.set('amount-2', '200');

		try {
			await updateBalances(formData);
		} catch (e) {
			// Catch redirect
		}

		// Expect 6 sql calls: 2 for balances, 4 for net worth
		expect(mockedSql).toHaveBeenCalledTimes(6);
		// Check net worth calculation
		expect(mockedSql).toHaveBeenNthCalledWith(6, expect.any(Array), expect.any(String), expect.any(String), 300, 300);
	});

	it('should throw an error if the database query fails', async () => {
		jest.spyOn(console, 'error').mockImplementation(() => {});
		(mockedAuth as jest.Mock).mockResolvedValue({user: {email: 'test@moneyflow.dev'}});
		(mockedSql as jest.Mock).mockRejectedValue(new Error('DB Error'));

		const formData = new FormData();
		formData.set('date', '2025-01-01');
		formData.set('amount-1', '100');

		await expect(updateBalances(formData)).rejects.toThrow('Failed to update balances');
	});

	it('throws an error if the date is invalid', async () => {
		(mockedAuth as jest.Mock).mockResolvedValue({user: {email: 'test@moneyflow.dev'}});
		const formData = new FormData();
		formData.set('date', 'invalid date');
		formData.set('amount-1', '100');

		await expect(updateBalances(formData)).rejects.toThrow('Failed to update balances');
	});
});

describe('DistPieChartData', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	it('throws an error if not logged in', async () => {
		(mockedAuth as jest.Mock).mockResolvedValue(null);
		await expect(DistPieChartData()).rejects.toThrow('Not logged in');
	});

	it('returns correctly formatted data for the pie chart', async () => {
		(mockedAuth as jest.Mock).mockResolvedValue({user: {email: 'test@moneyflow.dev'}});
		const mockAccounts = [
			{id: '1', name: 'Account 1'},
			{id: '2', name: 'Account 2'}
		];
		const mockBalances1 = [{amount: 100, date: '2025-01-01'}];
		const mockBalances2 = [{amount: 200, date: '2025-01-01'}];

		(mockedSql as jest.Mock)
			.mockResolvedValueOnce(mockAccounts)
			.mockResolvedValueOnce(mockBalances1)
			.mockResolvedValueOnce(mockBalances2);

		const result = await DistPieChartData();

		expect(result).toEqual([
			{account: 'Account 1', balance: 100},
			{account: 'Account 2', balance: 200}
		]);
	});

	it('handles accounts with no balances', async () => {
		(mockedAuth as jest.Mock).mockResolvedValue({user: {email: 'test@moneyflow.dev'}});
		const mockAccounts = [
			{id: '1', name: 'Account 1'},
			{id: '2', name: 'Account 2'}
		];

		(mockedSql as jest.Mock).mockResolvedValueOnce(mockAccounts).mockResolvedValueOnce([]).mockResolvedValueOnce([]);

		const result = await DistPieChartData();

		expect(result).toEqual([]);
	});

	it('should throw an error if the database query fails', async () => {
		jest.spyOn(console, 'error').mockImplementation(() => {});
		(mockedAuth as jest.Mock).mockResolvedValue({user: {email: 'test@moneyflow.dev'}});
		(mockedSql as jest.Mock).mockRejectedValue(new Error('DB Error'));

		await expect(DistPieChartData()).rejects.toThrow('DB Error');
	});
});

describe('MoM', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	it('throws an error if not logged in', async () => {
		(mockedAuth as jest.Mock).mockResolvedValue(null);
		await expect(MoM()).rejects.toThrow('Not logged in');
	});

	it('returns 0 for both if there is not enough data', async () => {
		(mockedAuth as jest.Mock).mockResolvedValue({user: {email: 'test@moneyflow.dev'}});
		(mockedSql as jest.Mock).mockResolvedValueOnce([{id: '123'}]).mockResolvedValueOnce([]);
		const result = await MoM();
		expect(result).toEqual({percMoM: 0, absMoM: 0});
	});

	it('returns correct percentage and absolute change', async () => {
		(mockedAuth as jest.Mock).mockResolvedValue({user: {email: 'test@moneyflow.dev'}});
		(mockedSql as jest.Mock)
			.mockResolvedValueOnce([{id: '123'}])
			.mockResolvedValueOnce([{amount: '150'}, {amount: '100'}]);
		const result = await MoM();
		expect(result).toEqual({percMoM: 50, absMoM: 50});
	});

	it('should throw an error if the database query fails', async () => {
		jest.spyOn(console, 'error').mockImplementation(() => {});
		const dbError = new Error('DB Error');
		(mockedAuth as jest.Mock).mockResolvedValue({user: {email: 'test@moneyflow.dev'}});
		(mockedSql as jest.Mock).mockRejectedValue(dbError);
		await expect(MoM()).rejects.toThrow('Error: Error: DB Error');
	});
});

describe('YoY', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	it('throws an error if not logged in', async () => {
		(mockedAuth as jest.Mock).mockResolvedValue(null);
		await expect(YoY()).rejects.toThrow('Not logged in');
	});

	it('returns 0 for both if there is not enough data', async () => {
		(mockedAuth as jest.Mock).mockResolvedValue({user: {email: 'test@moneyflow.dev'}});
		(mockedSql as jest.Mock)
			.mockResolvedValueOnce([{id: '123'}]) // account
			.mockResolvedValueOnce([]); // latest balance

		const result = await YoY();
		expect(result).toEqual({percYoY: 0, absYoY: 0});
	});

	it('returns correct percentage and absolute change', async () => {
		(mockedAuth as jest.Mock).mockResolvedValue({user: {email: 'test@moneyflow.dev'}});
		(mockedSql as jest.Mock)
			.mockResolvedValueOnce([{id: '123'}]) // account
			.mockResolvedValueOnce([{amount: '150', date: '2025-01-01'}]) // latest balance
			.mockResolvedValueOnce([{amount: '100'}]); // earliest balance

		const result = await YoY();
		expect(result).toEqual({percYoY: 50, absYoY: 50});
	});

	it('should throw an error if the database query fails', async () => {
		jest.spyOn(console, 'error').mockImplementation(() => {});
		const dbError = new Error('DB Error');
		(mockedAuth as jest.Mock).mockResolvedValue({user: {email: 'test@moneyflow.dev'}});
		(mockedSql as jest.Mock).mockRejectedValue(dbError);
		await expect(YoY()).rejects.toThrow('Error: Error: DB Error');
	});
});
