import {DBUser, CliUser, DBAccount, CliAccount, DBBalance} from './definitions.ts';
import axios, {AxiosInstance} from 'axios';

// Defaults
const api: AxiosInstance = axios.create({
	baseURL: process.env.VITE_SERVER,
	timeout: 1000,
	headers: {'Content-Type': 'application/json'}
});

//TODO: Call on page load/login
export function setAuthToken(token: string) {
	api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

// CRUD User

export async function createUser(user: any): Promise<{success: boolean, error?: string, user?: DBUser}> {
	try {
		const res = await api.post(`/user`, user);
		return res.data;
	} catch (error) {
		console.error(`createUser: ${error}`);
		throw new Error(`createUser: ${error}`);
	}
}

export async function getUser(authID: string): Promise<{success: boolean, error?: string, user?: DBUser}> {
	try {
		const res = await api.get(`/user?ID=${authID}`);
		return res.data;
	} catch (error) {
		console.error(`getUser: ${error}`);
		throw new Error(`getUser: ${error}`);
	}
}

export async function updateUser(authID: string, userData: CliUser): Promise<{success: boolean, error?: string, user?: DBUser}> {
	// TODO: Merge userData with current. Here or server.
	try {
		const res = await api.put(`/user?ID=${authID}`, userData);
		return res.data;
	} catch (error) {
		console.error(`updateUser: ${error}`);
		throw new Error(`updateUser: ${error}`);
	}
}

export async function deleteUser(authID: string): Promise<{success: boolean, error?: string}> {
	try {
		const res = await api.delete(`/user?ID=${authID}`);
		return res.data;
	} catch (error) {
		console.error(`deleteUser: ${error}`);
		throw new Error(`deleteUser: ${error}`);
	}
}

// CRUD Accounts

export async function createAccounts(accounts: CliAccount[]): Promise<{success: boolean}> {
	try {
		const res = await api.post('/accounts', accounts);
		return res.data;
	} catch (error) {
		console.error(`createAccounts: ${error}`);
		throw new Error(`createAccounts: ${error}`);
	}
}

export async function getAccounts(id: string): Promise<DBAccount[]> {
	try {
		const res = await api.get(`/accounts?id=${id}`);
		return res.data;
	} catch (error) {
		console.error(`getAccounts: ${error}`);
		throw new Error(`getAccounts: ${error}`);
	}
}

export async function updateAccounts(id: string, accounts: CliBalance[] | DBAccount): Promise<{success: boolean}> {
	try {
		const res = await api.put(`/accounts?id=${id}`, accounts);
		return res.data;
	} catch (error) {
		console.error(`updateAccounts: ${error}`);
		throw new Error(`updateAccounts: ${error}`);
	}
}

export async function deleteAccounts(id: string, accounts: any /*FIXME: Add Type*/): Promise<{success: boolean}> {
	try {
		const res = await api.delete(`/accounts?id=${id}`, accounts);
		return res.data;
	} catch (error) {
		console.error(`deleteAccounts: ${error}`);
		throw new Error(`deleteAccounts: ${error}`);
	}
}

// CRUD Balances

export async function createBalances(balances: CliAccount[]): Promise<{success: boolean}> {
	try {
		const res = await api.post('/balances', balances);
		return res.data;
	} catch (error) {
		console.error(`createBalances: ${error}`);
		throw new Error(`createBalances: ${error}`);
	}
}

export async function getBalances(id: string): Promise<DBBalance[]> {
	try {
		const res = await api.get(`/balances?id=${id}`);
		return res.data;
	} catch (error) {
		console.error(`getBalances: ${error}`);
		throw new Error(`getBalances: ${error}`);
	}
}

export async function updateBalances(id: string, balances: DBBalance[]): Promise<{success: boolean}> {
	try {
		const res = await api.put(`/balances?id=${id}`, balances);
		return res.data;
	} catch (error) {
		console.error(`updateBalances: ${error}`);
		throw new Error(`updateBalances: ${error}`);
	}
}

export async function deleteBalances(id: string, balances: any /*FIXME: Add Type*/): Promise<{success: boolean}> {
	try {
		const res = await api.delete(`/balances?id=${id}`, balances);
		return res.data;
	} catch (error) {
		console.error(`deleteBalances: ${error}`);
		throw new Error(`deleteBalances: ${error}`);
	}
}
