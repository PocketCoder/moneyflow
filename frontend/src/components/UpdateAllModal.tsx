import {useState, useContext} from 'react';
import UserContext from '../lib/UserContext';
import {pushUpdates} from '../lib/functions';
import UpdateCard from './UpdateCard';
import {DatePicker, Dialog, DialogPanel, Title, Subtitle, Button, Text} from '@tremor/react';
import {XMarkIcon, DocumentPlusIcon} from '@heroicons/react/24/outline';
import {useAuth0} from '@auth0/auth0-react';
import {toast} from 'react-toastify';
import {useMutation} from 'react-query';

export default function UpdateAllModal({isOpen, toggle}) {
	const {getAccessTokenSilently} = useAuth0();
	const {userData} = useContext(UserContext);
	const [date, setDate] = useState(new Date());
	const [newData, setNewData] = useState([]);

	const data = userData.accounts;

	const updateAccount = (accountObj, value) => {
		if (value === '') return;
		value.replace(/,/g, '');
		const newUpdate = {...accountObj, date: date, amount: value};
		setNewData((prevUpdates) => ({...prevUpdates, [accountObj.account]: newUpdate}));
	};

	const pushNewData = useMutation(
		async () => {
			const token = await getAccessTokenSilently();
			return await pushUpdates(newData, userData, token);
		},
		{
			onMutate: () => {
				toast('Creating...');
			},
			onError: (error) => {
				toast.error(`Mutation Error: ${error}`);
			},
			onSuccess: () => {
				toast.success('Accounts Updated');
				toggle();
			}
		}
	);

	return (
		<Dialog open={isOpen} onClose={toggle} static={true} className="w-screen h-screen max-h-screen">
			<DialogPanel className="w-full min-w-full min-h-full h-full overflow-y-scroll">
				<div className="flex justify-between items-center">
					<div>
						<Title>Update Balances</Title>
						<Subtitle>Update the balances in your accounts.</Subtitle>
						<Text>Leave blank if the balance has remaind the same.</Text>
					</div>
					<div className="flex flex-col justify-around items-center md:block">
						<Button
							className="mx-4 md:mb-0 mb-2"
							icon={XMarkIcon}
							size="xs"
							variant="secondary"
							color="red"
							onClick={toggle}>
							Close
						</Button>
						<Button
							icon={DocumentPlusIcon}
							size="xs"
							variant="primary"
							onClick={() => {
								pushNewData.mutate();
							}}>
							Save
						</Button>
					</div>
				</div>
				<div className="w-full flex flex-col justify-between items-start my-4">
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
					<div className="overflow-y-scroll w-full h-[70vh] flex flex-wrap justify-evenly p-2">
						{data &&
							data.map((a, i) => <UpdateCard newData={newData} setNewData={updateAccount} account={a} key={i} />)}
					</div>
				</div>
			</DialogPanel>
		</Dialog>
	);
}
