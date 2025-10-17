import * as React from 'react';

export function TrendingUpIcon({
	size = 24,
	color = 'currentColor',
	strokeWidth = 2,
	className,
	...props
}: React.SVGProps<SVGSVGElement> & {
	size?: number;
	color?: string;
	strokeWidth?: number;
}) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={size}
			height={size}
			viewBox="0 0 24 24"
			fill="none"
			stroke={color}
			strokeWidth={strokeWidth}
			strokeLinecap="round"
			strokeLinejoin="round"
			className={className}
			{...props}>
			<path d="M16 7h6v6" />
			<path d="m22 7l-8.5 8.5l-5-5L2 17" />
		</svg>
	);
}
