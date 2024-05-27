import {useContext} from 'react';
import {
	Dialog,
	DialogPanel,
	Title,
	Subtitle,
	Button,
	LineChart,
	TabGroup,
	TabList,
	Tab,
	TabPanels,
	TabPanel,
	Table,
	TableHead,
	TableHeaderCell,
	TableBody,
	TableRow,
	TableCell
} from '@tremor/react';
import {XMarkIcon} from '@heroicons/react/24/outline';
import PrefContext from '../../lib/PrefContext';

export default function AccountModal({isOpen, setIsOpen, account}) {
	const {preferences} = useContext(PrefContext);
	const year = preferences.year;
	const chartData = account.years[year];
	chartData.sort((a, b) => new Date(a.date) - new Date(b.date));
	const valueFormatter = (number: number) =>
		`${new Intl.NumberFormat('en-GB', {style: 'currency', currency: 'GBP'}).format(number).toString()}`;
	const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.getMonth() + 1; // Month is zero-based
        const year = date.getFullYear();
        return `${day}/${month < 10 ? '0' : ''}${month}/${year}`;
    };
	return (
		<Dialog open={isOpen} onClose={(val) => setIsOpen(val)} static={true}>
			<DialogPanel>
				<div className="flex justify-between items-center">
					<div>
						<Title>{account.name}</Title>
						<Subtitle>
							{account.parent} &bull; {account.type}
						</Subtitle>
					</div>
					<div>
						<Button
							className="mr-2"
							icon={XMarkIcon}
							size="xs"
							variant="secondary"
							color="red"
							onClick={() => setIsOpen(false)}>
							Close
						</Button>
					</div>
				</div>
				<TabGroup>
					<TabList>
						<Tab>Chart</Tab>
						<Tab>Table</Tab>
					</TabList>
					<TabPanels>
						<TabPanel>
							<LineChart
								className=""
								data={chartData}
								index={"date"} // FIXME: Format Date
								categories={['amount']}
								colors={['emerald']}
								valueFormatter={valueFormatter}
								showAnimation={true}
							/>
						</TabPanel>
						<TabPanel>
							<Table>
								<TableHead>
									<TableRow>
										<TableHeaderCell>Date</TableHeaderCell>
										<TableHeaderCell>Amount</TableHeaderCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{chartData.map((item, index) => (
										<TableRow key={`${index}_${item.name}`}>
											<TableCell>{item.date}</TableCell>
											<TableCell>£{item.amount}</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</TabPanel>
					</TabPanels>
				</TabGroup>
			</DialogPanel>
		</Dialog>
	);
}
