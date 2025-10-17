import {Card} from '@/components/Tremor/Card';
import {Badge} from '@/components/ui/badge';
import {TrendingUpIcon} from '@/components/ui/icons/lucide-trending-up';
import {TrendingDownIcon} from '@/components/ui/icons/lucide-trending-down';
import clsx from 'clsx';
import {currencyFormatter} from '@/lib/utils';

interface StatCardProps {
	title: string;
	value: string;
	change: number;
	changeFormatted: string;
}

export function StatCard({title, value, change, changeFormatted}: StatCardProps) {
	return (
		<Card className="col-span-1 flex flex-col justify-evenly whitespace-nowrap">
			<h2 className="text-2xl font-bold">{value}</h2>
			<Badge
				variant={'secondary'}
				className={clsx({
					'w-fit gap-1 text-white': true,
					'bg-green-500': change > 0,
					'bg-red-500': change < 0,
					'bg-black': change === 0
				})}>
				{changeFormatted}
				{change > 0 ? <TrendingUpIcon /> : <TrendingDownIcon />}
			</Badge>
			<span className="text-sm text-gray-500">{title}</span>
		</Card>
	);
}
