import {useAuth0} from '@auth0/auth0-react';
import {SignupButton} from '../components/buttons/SignUpButton';
import {LoginButton} from '../components/buttons/LoginButton';
import {LogoutButton} from '../components/buttons/LogoutButton';

export default function Profile() {
	const {user} = useAuth0();
	return (
		<main className="p-6 h-full w-full mb-16">
			<h1 className="text-2xl">Profile</h1>
			{!user && (
				<>
					<div className="mt-14 text-center">
						<p>Not logged in.</p>
					</div>
					<div className="w-screen fixed bottom-24 left-0 flex justify-evenly items-center">
						<SignupButton />
						<LoginButton />
					</div>
				</>
			)}
			{user && (
				<>
					<p>Logged in as: {user.email}</p>
					<span>{user.sub}</span>
					<LogoutButton />
				</>
			)}
		</main>
	);
}
