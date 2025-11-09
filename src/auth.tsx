import * as React from 'react';
import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';
import NeonAdapter from '@auth/neon-adapter';
import Mailgun from 'next-auth/providers/mailgun';
import {Pool} from '@neondatabase/serverless';
import {render} from '@react-email/render';
import {SignInEmail} from '../emails/signin-email';
import {Html} from '@react-email/components';

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
				server: 'https://api.eu.mailgun.net/v3/110399.xyz/messages',
				sendVerificationRequest: async ({identifier, url, provider}) => {
					const {host} = new URL(url);
					const emailComponent = <SignInEmail url={url} />;
					const html = await render(emailComponent);
					const response = await fetch(provider.server, {
						method: 'POST',
						headers: {
							Authorization: `Basic ${btoa(`api:${provider.apiKey}`)}`,
							'Content-Type': 'application/x-www-form-urlencoded'
						},
						body: new URLSearchParams({
							from: provider.from ?? '',
							to: identifier,
							subject: `Sign in to ${host}`,
							html
						})
					});

					if (!response.ok) {
						throw new Error('Email sending failed.');
					}
				}
			})
		]
	};
});
