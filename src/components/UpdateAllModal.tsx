import {useEffect, useState} from 'react';
import {Card, Title, Subtitle, Button} from '@tremor/react';
import {XMarkIcon} from '@heroicons/react/24/outline';
import {fetchAccounts} from '../lib/data';

export default function UpdateAllModal({closeModal}) {
	const [data, setData] = useState(null);
	useEffect(() => {
		const fetchData = async () => {
			try {
				const res = await fetchAccounts(process.env.USERID);
				console.log(res);
				setData(res);
			} catch (error) {
				console.error('Error fetching data:', error);
			}
		};

		fetchData();
	}, []);
	return (
		<div className="fixed top-0 left-0 w-full h-full flex items-center justify-center backdrop-blur-sm">
			<Card className="w-2/3 h-2/3 p-6 bg-white border">
				<Title>Update Balances</Title>
				<Subtitle>Update the balances in your accounts. Leave blank if the balance has remaind the same.</Subtitle>
				<div className="w-full h-fit flex justify-end items-end my-4">
					{<pre>{JSON.stringify(data)}</pre>}
					<Button className="mr-2" icon={XMarkIcon} size="xs" variant="secondary" color="red" onClick={closeModal}>
						Close
					</Button>
				</div>
			</Card>
		</div>
	);
}
