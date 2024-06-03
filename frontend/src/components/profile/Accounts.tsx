import {useContext} from 'react';
import {useAuth0} from '@auth0/auth0-react';
import UserContext from '../../lib/UserContext';
import {Card, Title, Subtitle, Text, Badge, Button, TextInput} from '@tremor/react';
import {MinusCircleIcon, PlusCircleIcon} from '@heroicons/react/24/outline';
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
			setUserData({...userData, accounts: updatedAccounts});
			try {
				const token = await getAccessTokenSilently();
				await pushNewTags(
					{id: userData.id, accountID: userData.accounts[accountIndex].id, tags: userData.accounts[accountIndex].tags},
					token
				);
			} catch (err) {
				console.error('Error', err);
				throw new Error(err);
			}
		}
	};

	const handleRemoveTag = async (accountIndex, tagIndex) => {
		const updatedAccounts = [...userData.accounts];
		updatedAccounts[accountIndex].tags.splice(tagIndex, 1);
		setUserData({...userData, accounts: updatedAccounts});
		try {
			const token = await getAccessTokenSilently();
			await pushNewTags(
				{id: userData.id, accountID: userData.accounts[accountIndex].id, tags: updatedAccounts[accountIndex].tags},
				token
			);
		} catch (err) {
			console.error('Error', err);
			throw new Error(err);
		}
	};

	const handleNewTagChange = async (accountIndex, value) => {
		const updatedAccounts = [...userData.accounts];
		updatedAccounts[accountIndex].newTag = value;
		setUserData({...userData, accounts: updatedAccounts});
	};

	return (
		<>
			{userData.accounts.map((a, i) => (
				<Card key={i} className="my-2 mx-1 w-5/12 h-fit">
					<div className="flex flex-row justify-between items-center">
						<div>
							<Title>{a.name}</Title>
							<Subtitle>{a.parent}</Subtitle>
							<Text>{a.type}</Text>
						</div>
						<div>
							<div className="flex items-center mt-2">
								<TextInput
									value={a.newTag || ''}
									onChange={(e) => handleNewTagChange(i, e.target.value)}
									placeholder="Add new tag"
									className="mx-1"
								/>
								<Button
									onClick={() => handleAddTag(i)}
									size="xs"
									className="p-0 mx-1 bg-transparent border-none hover:bg-blue-300">
									<PlusCircleIcon className="text-black h-6" />
								</Button>
							</div>
						</div>
					</div>
					<div className="w-full mt-5 flex flex-row justify-start items-center flex-wrap">
						{a.tags.map((t, z) => (
							<div key={`${t}_${z}`} className="flex items-center mr-4 my-1">
								<>
									<Badge>{t}</Badge>
									<Button
										onClick={() => handleRemoveTag(i, z)}
										size="xs"
										className="p-0 mx-1 bg-transparent border-none hover:bg-blue-300"
										tooltip="Delete tag">
										<MinusCircleIcon className="text-black h-6" />
									</Button>
								</>
							</div>
						))}
					</div>
				</Card>
			))}
		</>
	);
}
