// Tremor Button [v0.2.0]

import React from 'react';
import {Slot} from '@radix-ui/react-slot';
import {RiLoader2Fill} from '@remixicon/react';
import {tv, type VariantProps} from 'tailwind-variants';

import {cx, focusRing} from '@/lib/utils';

const buttonVariants = tv({
	base: [
		// base
		'relative inline-flex items-center justify-center whitespace-nowrap rounded-md border px-3 py-2 text-center text-sm font-medium shadow-sm transition-all duration-100 ease-in-out',
		// disabled
		'disabled:pointer-events-none disabled:shadow-none',
		// focus
		focusRing
	],
	variants: {
		variant: {
			primary: [
				// border
				'border-transparent',
				// text color
				'text-primary-foreground',
				// background color
				'bg-primary',
				// hover color
				'hover:bg-primary/90',
				// disabled
				'disabled:bg-primary/50 disabled:text-primary-foreground'
			],
			secondary: [
				// border
				'border-border',
				// text color
				'text-foreground',
				// background color
				'bg-secondary',
				//hover color
				'hover:bg-secondary/80',
				// disabled
				'disabled:text-muted-foreground'
			],
			light: [
				// base
				'shadow-none',
				// border
				'border-transparent',
				// text color
				'text-muted-foreground',
				// background color
				'bg-muted',
				// hover color
				'hover:bg-muted/80',
				// disabled
				'disabled:bg-muted/50 disabled:text-muted-foreground'
			],
			ghost: [
				// base
				'shadow-none',
				// border
				'border-transparent',
				// text color
				'text-foreground',
				// hover color
				'bg-transparent hover:bg-accent hover:text-accent-foreground',
				// disabled
				'disabled:text-muted-foreground'
			],
			destructive: [
				// text color
				'text-destructive-foreground',
				// border
				'border-transparent',
				// background color
				'bg-destructive',
				// hover color
				'hover:bg-destructive/90',
				// disabled
				'disabled:bg-destructive/50 disabled:text-destructive-foreground'
			]
		}
	},
	defaultVariants: {
		variant: 'primary'
	}
});

interface ButtonProps extends React.ComponentPropsWithoutRef<'button'>, VariantProps<typeof buttonVariants> {
	asChild?: boolean;
	isLoading?: boolean;
	loadingText?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{asChild, isLoading = false, loadingText, className, disabled, variant, children, ...props}: ButtonProps,
		forwardedRef
	) => {
		const Component = asChild ? Slot : 'button';
		return (
			<Component
				ref={forwardedRef}
				className={cx(buttonVariants({variant}), className)}
				disabled={disabled || isLoading}
				tremor-id="tremor-raw"
				{...props}>
				{isLoading ? (
					<span className="pointer-events-none flex shrink-0 items-center justify-center gap-1.5">
						<RiLoader2Fill className="size-4 shrink-0 animate-spin" aria-hidden="true" />
						<span className="sr-only">{loadingText ? loadingText : 'Loading'}</span>
						{loadingText ? loadingText : children}
					</span>
				) : (
					children
				)}
			</Component>
		);
	}
);

Button.displayName = 'Button';

export {Button, buttonVariants, type ButtonProps};
