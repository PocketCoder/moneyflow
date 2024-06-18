import {useAuth0} from '@auth0/auth0-react';
import {useContext, useState} from 'react';

import {Title, TextInput, Button, Accordion, AccordionBody, AccordionHeader, AccordionList} from '@tremor/react';
import {TrophyIcon, ChevronRightIcon, InformationCircleIcon} from '@heroicons/react/24/outline';
import {toast} from 'react-toastify';
import {useMutation} from 'react-query';

import UserContext from '../lib/UserContext';
import PrefContext from '../lib/PrefContext.tsx';

import Accounts from '../components/profile/Accounts.tsx';
import InfoBox from '../components/profile/InfoBox';
import {SignupButton} from '../components/buttons/SignUpButton';
import {LoginButton} from '../components/buttons/LoginButton';
import {LogoutButton} from '../components/buttons/LogoutButton';

import {calcNetWorthHistory} from '../lib/functions';
import {pushNewPreferences} from '../lib/data.ts';

export default function Profile() {
	const {user, getAccessTokenSilently} = useAuth0();

	const {userData, setUserData} = useContext(UserContext);
	const {preferences: prefs} = useContext(PrefContext);
	const goal = userData.prefs['goal'][prefs.year] || 0;

	const [newGoal, setNewGoal] = useState(goal);
	const [isInfoOpen, setIsInfoOpen] = useState(false);

	function setGoal(goal) {
		setNewGoal(goal);
	}

	const mutation = useMutation(
		async () => {
			userData.prefs['goal'][prefs.year] = parseInt(newGoal);
			const token = await getAccessTokenSilently();
			return pushNewPreferences(userData.id, userData.prefs, token);
		},
		{
			onMutate: () => {
				toast('Saving...');
			},
			onError: (error) => {
				toast.error(`Mutation Error: ${error}`);
			},
			onSuccess: () => {
				toast.success('Goal Updated');
			}
		}
	);

	function saveNewGoal() {
		mutation.mutate();
	}

	return (
		<main className="p-6 h-full w-full mb-16">
			<InfoBox isOpen={isInfoOpen} setIsOpen={setIsInfoOpen} />
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
					<div className="w-full flex flex-col items-center justify-evenly pb-20">
						<div className="mt-6 w-full">
							<div className="w-full flex justify-between items-center py-2 px-4 my-2 border-solid border-gray-300 border rounded-md">
								<span>Change Email</span>
								<div className="flex items-center">
									<span className="text-gray-500">{user.email}</span>
									<ChevronRightIcon className="w-7 text-gray-600" />
								</div>
							</div>
						</div>
						<div className="w-full">
							<div className="w-full flex justify-between items-center py-2 px-4 my-2 border-solid border-gray-300 border rounded-md">
								<span>End of year goal</span>
								<div className="flex justify-end items-center w-2/6">
									<TextInput
										className="w-1/2"
										type="text"
										icon={TrophyIcon}
										placeholder={`Current: ${goal}`}
										onValueChange={(e) => {
											setGoal(e);
										}}
									/>
									<Button onClick={saveNewGoal} size="xs" className="ml-4">
										Save Goal
									</Button>
								</div>
							</div>
						</div>
						<div className="mt-6 w-full">
							<AccordionList>
								<Accordion>
									<AccordionHeader>
										<Title className="mr-2">Account Editor</Title>
										<Button icon={InformationCircleIcon} variant="light" onClick={() => setIsInfoOpen(true)}></Button>
									</AccordionHeader>
									<AccordionBody className="flex flex-wrap flex-row justify-center items-start">
										<Accounts />
									</AccordionBody>
								</Accordion>
							</AccordionList>
						</div>
						<div className="mt-6 w-full">
							<div className="w-full flex justify-between items-center py-2 px-4 my-2 border-solid border-gray-300 border rounded-md">
								<span>Recalculate Net Worth</span>
								<Button onClick={() => calcNetWorthHistory(userData)}>Recaculate</Button>
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
