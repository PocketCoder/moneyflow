import {useState, useEffect, useContext} from 'react';
import UserContext from '../lib/UserContext';
import {pushUpdates} from '../lib/functions';
import UpdateCard from './UpdateCard';
import {DatePicker, Dialog, DialogPanel, Title, Subtitle, Button, Text} from '@tremor/react';
import {XMarkIcon, DocumentPlusIcon} from '@heroicons/react/24/outline';
import {useAuth0} from '@auth0/auth0-react';

export default function UpdateAllModal({usrData, isOpen, toggle}) {
	const {getAccessTokenSilently, loginWithRedirect} = useAuth0();
	const {userData} = useContext(UserContext);
	const [data, setData] = useState(usrData.accounts);
	const [date, setDate] = useState(new Date());
	const [newData, setNewData] = useState([]);
	const updateAccount = (accountObj, value) => {
		if (value === '') return;
		const newUpdate = {...accountObj, date: new Date(), amount: value};
		setNewData((prevUpdates) => ({...prevUpdates, [accountObj.account]: newUpdate}));
	};

	async function pushNewData() {
		let token;
		try {
			token = await getAccessTokenSilently();
			const result = await pushUpdates(newData, userData, token);
			if (result?.success) {
			}
		} catch (e) {
			console.error(`Token Failed: ${e}`);
			await loginWithRedirect({
				appState: {
					returnTo: '/dashboard'
				}
			});
		}
	}

	return (
		<Dialog open={isOpen} onClose={toggle} static={true}>
			<DialogPanel className="min-w-fit max-w-screen max-h-screen overflow-y-scroll">
				<div className="flex justify-between items-center">
					<div>
						<Title>Update Balances</Title>
						<Subtitle>Update the balances in your accounts. Leave blank if the balance has remaind the same.</Subtitle>
					</div>
					<div>
						<Button className="mx-4" icon={XMarkIcon} size="xs" variant="secondary" color="red" onClick={toggle}>
							Close
						</Button>
						<Button icon={DocumentPlusIcon} size="xs" variant="primary" onClick={pushNewData}>
							Save
						</Button>
					</div>
				</div>
				<div className="w-full h-4/5 flex flex-col justify-between items-start my-4">
					<div className="flex flex-row justify-center items-center w-full">
						<Text>Date of update: </Text>
						<DatePicker
							weekStartsOn={1}
							maxDate={new Date()}
							defaultValue={new Date()}
							onValueChange={(d) => setDate(d)}
							className="max-w-sm ml-10"
						/>
					</div>
					<div className="overflow-y-scroll w-full max-w-full max-h-full h-full flex flex-wrap justify-evenly p-2">
						{data &&
							data.map((a, i) => <UpdateCard newData={newData} setNewData={updateAccount} account={a} key={i} />)}
					</div>
				</div>
			</DialogPanel>
		</Dialog>
	);
}
