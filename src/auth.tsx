import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';
import NeonAdapter from '@auth/neon-adapter';
import {Pool} from '@neondatabase/serverless';

export const {handlers, signIn, signOut, auth} = NextAuth(() => {
	const pool = new Pool({connectionString: process.env.DATABASE_URL});
	return {
		adapter: NeonAdapter(pool),
		providers: [GitHub]
	};
});
