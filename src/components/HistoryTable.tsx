import type {BalanceData} from '@/lib/types';
import {Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRoot, TableRow} from '@/components/Tremor/Table';
import {Card} from '@/components/Tremor/Card';
import {formatter} from '@/lib/utils';

export default function HistoryTable({balanceData}: {balanceData: BalanceData[]}) {
	return (
		<Card className="h-fit w-full md:w-1/2">
			<h2 className="mb-2 text-xl font-bold">History</h2>
			<TableRoot>
				<Table>
					<TableHead>
						<TableRow>
							<TableHeaderCell>Date</TableHeaderCell>
							<TableHeaderCell>Amount (£)</TableHeaderCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{balanceData.map((balance: BalanceData, i: number) => (
							<TableRow key={i}>
								<TableCell>{balance.date}</TableCell>
								<TableCell>{formatter.format(balance.amount)}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableRoot>
		</Card>
	);
}
