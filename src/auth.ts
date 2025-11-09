import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';
import NeonAdapter from '@auth/neon-adapter';
import Mailgun from 'next-auth/providers/mailgun';
import {Pool} from '@neondatabase/serverless';

export const {handlers, signIn, signOut, auth} = NextAuth(() => {
	const pool = new Pool({connectionString: process.env.DATABASE_URL});
	return {
		adapter: NeonAdapter(pool),
		providers: [
			GitHub,
			Mailgun({
				apiKey: process.env.AUTH_MAILGUN_KEY,
				from: 'no-reply@110399.xyz',
				region: 'EU',
				server: 'https://api.eu.mailgun.net/v3/110399.xyz/messages'
			})
		]
	};
});
