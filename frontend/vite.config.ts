import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(() => {
	return {
		// vite config
		plugins: [react()],
		define: {
			__APP_ENV__: process.env.VITE_VERCEL_ENV
		}
	};
});
