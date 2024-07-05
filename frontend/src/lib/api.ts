import {DBUser} from './definitions.ts';
import axios, { AxiosInstance } from 'axios';
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

export async function createUser(user: any): Promise<{success: boolean}> {
    try {
        const res = await api.post(`/user`, user);
        return res.data;
    } catch (error) {
        console.error(`createUser: ${error}`);
        throw new Error(`createUser: ${error}`);
    }
}

export async function getUser(authID: string): Promise<DBUser> {
    try {
        const res = await api.get(`/user?ID=${authID}`);
        return res.data;
    } catch (error) {
        console.error(`getUser: ${error}`);
        throw new Error(`getUser: ${error}`);
    }
}

export async function updateUser(authID: string, userData: Partial<DBUser>): Promise<{success: boolean}> {
    try {
        const res = await api.put(`/user?ID=${authID}`, userData);
        return res.data;
    } catch (error) {
        console.error(`updateUser: ${error}`);
        throw new Error(`updateUser: ${error}`);
    }
}

export async function deleteUser(authID: string): Promise<{success: boolean}> {
    try {
        const res = await api.delete(`/user?ID=${authID}`);
        return res.data;
    } catch (error) {
        console.error(`deleteUser: ${error}`);
        throw new Error(`deleteUser: ${error}`);
    }
}