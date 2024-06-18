import {useContext} from 'react';
import clsx from 'clsx';
import {useAuth0} from '@auth0/auth0-react';
import {Card, Title, Subtitle, Text, Button, TextInput, Switch} from '@tremor/react';
import {PlusCircleIcon, XMarkIcon} from '@heroicons/react/24/outline';
import {toast} from 'react-toastify';
import {useMutation} from 'react-query';

import UserContext from '../../lib/UserContext';

import {pushNewTags} from '../../lib/data';

export default function Accounts() {
	const {getAccessTokenSilently} = useAuth0();
	const {userData, setUserData} = useContext(UserContext);

	const handleAddTag = async (accountIndex) => {
		const updatedAccounts = [...userData.accounts];
		const newTag = updatedAccounts[accountIndex].newTag.trim();
		if (newTag) {
			updatedAccounts[accountIndex].tags.push(newTag);
			updatedAccounts[accountIndex].newTag = '';
			tagChangeMutation.mutate(updatedAccounts[accountIndex]);
			setUserData({...userData, accounts: updatedAccounts});
		}
	};

	const handleRemoveTag = async (accountIndex, tagIndex) => {
		const updatedAccounts = [...userData.accounts];
		updatedAccounts[accountIndex].tags.splice(tagIndex, 1);
		tagChangeMutation.mutate(updatedAccounts[accountIndex]);
		setUserData({...userData, accounts: updatedAccounts});
	};

	const handleNewTagChange = async (accountIndex, value) => {
		const updatedAccounts = [...userData.accounts];
		updatedAccounts[accountIndex].newTag = value;
		setUserData({...userData, accounts: updatedAccounts});
	};

	function handleTouchSwitchChange(a) {
		const status = a.tags.includes('touchable') ? 'touchable' : 'untouchable';
		a.tags = a.tags.filter((tag) => tag !== status);
		a.tags.push(status === 'touchable' ? 'untouchable' : 'touchable');
		switchChangeMutation.mutate(a);
	}

	function handleActiveSwitchChange(a) {
		const status = a.tags.includes('active') ? 'active' : 'inactive';
		a.tags = a.tags.filter((tag) => tag !== status);
		a.tags.push(status === 'active' ? 'inactive' : 'active');
		switchChangeMutation.mutate(a);
	}

	const tagChangeMutation = useMutation(
		async (a: object) => {
			const token = await getAccessTokenSilently();
			return pushNewTags(userData.id, a, token);
		},
		{
			onMutate: () => {
				toast('Saving...');
			},
			onError: (error) => {
				toast.error(`Tag Change Error: ${error}`);
			},
			onSuccess: () => {
				toast.success('Tags Updated');
			}
		}
	);

	const switchChangeMutation = useMutation(
		async (a: object) => {
			const token = await getAccessTokenSilently();
			return pushNewTags(userData.id, a, token);
		},
		{
			onMutate: () => {
				toast('Saving...');
			},
			onError: (error) => {
				toast.error(`Switch Change Error: ${error}`);
			},
			onSuccess: () => {
				toast.success('Status Updated');
			}
		}
	);

	return (
		<>
			{userData.accounts.map((a, i) =>
				a.name === 'Net Worth' ? (
					<></>
				) : (
					<Card key={`${a.name}_${i}`} className="my-2 mx-1 min-w-fit w-[49%] h-fit">
						<div className="flex flex-row justify-between items-start">
							<div>
								<Title>{a.name}</Title>
								<Subtitle>{a.parent}</Subtitle>
								<Text>{a.type}</Text>
							</div>
							<div className="flex flex-col mt-1">
								<div className="flex flex-row w-full justify-evenly">
									<Text
										className={clsx({
											'text-black': a.tags.includes('inactive'),
											underline: a.tags.includes('inactive')
										})}>
										Inactive
									</Text>
									<Switch
										className="px-2"
										defaultChecked={a.tags.includes('active')}
										onChange={(e) => handleActiveSwitchChange(a)}
									/>
									<Text
										className={clsx({
											'text-black': a.tags.includes('active'),
											underline: a.tags.includes('active')
										})}>
										Active
									</Text>
								</div>
								{a.type === 'Debt' ? (
									<></>
								) : (
									<div className="flex flex-row w-full justify-evenly">
										<Text
											className={clsx({
												'text-black': a.tags.includes('untouchable'),
												underline: a.tags.includes('untouchable')
											})}>
											Untouchable
										</Text>
										<Switch
											className="px-2"
											defaultChecked={a.tags.includes('touchable')}
											onChange={(e) => handleTouchSwitchChange(a)}
										/>
										<Text
											className={clsx({
												'text-black': a.tags.includes('touchable'),
												underline: a.tags.includes('touchable')
											})}>
											Touchable
										</Text>
									</div>
								)}
							</div>
						</div>
						<div className="w-full mt-5 flex flex-row justify-between items-center">
							<Text className="mr-2">Tags:</Text>
							<div className="w-full flex flex-row justify-start items-center flex-nowrap overflow-y-scroll">
								{a.tags.map((t, z) =>
									t === 'touchable' || t === 'untouchable' || t === 'active' || t === 'inactive' ? (
										<></>
									) : (
										<div
											key={`${t}_${z}`}
											className="flex justify-start items-center mr-1 p-1 border-solid border-2 rounded">
											<Text className="font-mono text-xs">{t}</Text>
											<Button
												onClick={() => handleRemoveTag(i, z)}
												size="xs"
												className="p-0.5 ml-1 bg-red-200 border-none hover:bg-blue-300"
												tooltip="Delete tag">
												<XMarkIcon className="text-black h-3" />
											</Button>
										</div>
									)
								)}
							</div>
							<TextInput
								value={a.newTag || ''}
								onChange={(e) => handleNewTagChange(i, e.target.value)}
								placeholder="Add new tag..."
								className="mx-1"
							/>
							<Button
								onClick={() => {
									handleAddTag(i);
								}}
								size="xs"
								className="p-0 mx-1 hover:bg-blue-600 border-none bg-transparent">
								<PlusCircleIcon className="text-black h-6 hover:text-white" />
							</Button>
						</div>
					</Card>
				)
			)}
		</>
	);
}
