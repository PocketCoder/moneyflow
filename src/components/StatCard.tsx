import {Card} from '@/components/Tremor/Card';
import {Badge} from '@/components/ui/badge';
import {TrendingUpIcon} from '@/components/ui/icons/lucide-trending-up';
import {TrendingDownIcon} from '@/components/ui/icons/lucide-trending-down';
import clsx from 'clsx';

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
					'text-primary-foreground w-fit gap-1': true,
					'bg-primary': change > 0,
					'bg-destructive': change < 0,
					'bg-foreground': change === 0
				})}>
				{changeFormatted}
				{change > 0 ? <TrendingUpIcon /> : <TrendingDownIcon />}
			</Badge>
			<span className="text-muted-foreground text-sm">{title}</span>
		</Card>
	);
}
