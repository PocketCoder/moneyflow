import {Card, Button} from '@tremor/react';

export default function YearSelector({years, preferences, setPreferences}) {
	const sortedYears = [...years].sort((a, b) => b - a);

	return (
		<Card className="h-fit max-h-fit py-4 px-1 min-w-fit max-w-max fixed bottom-20 left-1/2 transform -translate-x-1/2 flex justify-evenly items-center">
			{sortedYears.length === 0 ? (
				<Button size="xs" variant="secondary" className="mx-5">
					No data
				</Button>
			) : (
				sortedYears.map((year) => (
					<Button
						key={year}
						size="xs"
						variant={preferences.year === year ? 'primary' : 'secondary'}
						className="mx-5"
						onClick={() => setPreferences({year})}>
						{year}
					</Button>
				))
			)}
		</Card>
	);
}
