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
			<Badge variant={change > 0 ? 'default' : change < 0 ? 'destructive' : 'secondary'} className="w-fit gap-1">
				{changeFormatted}
				{change > 0 ? <TrendingUpIcon /> : <TrendingDownIcon />}
			</Badge>
			<span className="text-muted-foreground text-sm">{title}</span>
		</Card>
	);
}
