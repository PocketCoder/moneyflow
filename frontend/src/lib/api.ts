import {DBUser} from './definitions.ts';
import axios, { AxiosInstance } from 'axios';

// Defaults
const api: AxiosInstance = axios.create({
	baseURL: process.env.VITE_SERVER,
	timeout: 1000,
	headers: {'Content-Type': 'application/json'}
});

//TODO: Call on page load/login
export function setAuthToken(token: string) {
	api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};
