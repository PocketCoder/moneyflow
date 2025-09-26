import {saveNewAccountAndBalance, checkNetWorthRowExistsandCreate, saveBalance, getAccount} from '@/lib/server-utils';
import {auth} from '@/auth';
import {sql} from '@/lib/db';
import {revalidatePath} from 'next/cache';
import {Session} from 'next-auth';
import {Account} from '@/lib/types';

jest.mock('@/auth', () => ({
	auth: jest.fn()
}));

jest.mock('@/lib/db', () => ({
	sql: jest.fn()
}));

jest.mock('next/cache', () => ({
	revalidatePath: jest.fn()
}));

const mockedAuth = jest.mocked(auth);
const mockedSql = jest.mocked(sql);
const mockedRevalidatePath = jest.mocked(revalidatePath);

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
		// @ts-expect-error
		await expect(saveBalance('123', '200')).rejects.toThrow('Missing parameters.');
		// @ts-expect-error
		await expect(saveBalance('123')).rejects.toThrow('Missing parameters.');
		// @ts-expect-error
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
