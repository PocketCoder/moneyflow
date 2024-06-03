import {useAuth0} from '@auth0/auth0-react';
import {useContext} from 'react';
import UserContext from '../lib/UserContext';
import {SignupButton} from '../components/buttons/SignUpButton';
import {LoginButton} from '../components/buttons/LoginButton';
import {LogoutButton} from '../components/buttons/LogoutButton';
import {TextInput, Button} from '@tremor/react';
import {TrophyIcon, ChevronRightIcon} from '@heroicons/react/24/outline';
import {sumNetWorth} from '../lib/functions';
import Accounts from '../components/profile/Accounts.tsx';

export default function Profile() {
	const {user} = useAuth0();
	const {userData, setUserData} = useContext(UserContext);
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
					<div className="flex justify-between items-center">
						<p>Logged in as: {user.email}</p>
						<LogoutButton />
					</div>
					<div className="w-full flex flex-col items-center justify-evenly">
						<div className="mt-6 w-full">
							<div className="w-full flex justify-between items-center py-2 px-4 my-2 border-solid border-gray-300 border rounded-md">
								<span>Change Email</span>
								<div className="flex items-center">
									<span className="text-gray-500">{user.email}</span>
									<ChevronRightIcon className="w-7 text-gray-600" />
								</div>
							</div>
						</div>
						<div className="mt-6 w-full">
							<div className="w-full flex justify-between items-center py-2 px-4 my-2 border-solid border-gray-300 border rounded-md">
								<span>End of year goal</span>
								<TextInput className="w-1/3" type="text" icon={TrophyIcon} />
							</div>
						</div>
						<div className="mt-6 w-full flex flex-wrap flex-row justify-between items-start">
							<Accounts />
						</div>
						<div className="mt-6 w-full">
							<div className="w-full flex justify-between items-center py-2 px-4 my-2 border-solid border-gray-300 border rounded-md">
								<span>Recalculate Net Worth</span>
								<Button onClick={() => sumNetWorth(userData)}>Recaculate</Button>
							</div>
							<div className="w-full flex justify-between items-center py-2 px-4 my-2 border-solid border-gray-300 border rounded-md">
								<span>Export My Data</span>
								<ChevronRightIcon className="w-7 text-gray-600" />
							</div>
						</div>
					</div>
				</>
			)}
		</main>
	);
}
