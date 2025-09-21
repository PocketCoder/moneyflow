// Tremor SelectNative [v1.0.0]

import React from 'react';
import {tv, type VariantProps} from 'tailwind-variants';

import {cx, focusInput, hasErrorInput} from '@/lib/utils';

const selectNativeStyles = tv({
	base: [
		// base
		'peer w-full cursor-pointer appearance-none truncate rounded-md border py-2 pl-3 pr-7 shadow-xs outline-hidden transition-all sm:text-sm',
		// background color
		'bg-white',
		// border color
		'border-gray-300',
		// text color
		'text-gray-900',
		// placeholder color
		'placeholder-gray-400',
		// hover
		'hover:bg-gray-50',
		// disabled
		'disabled:pointer-events-none',
		'disabled:bg-gray-100 disabled:text-gray-400',
		// focus
		focusInput,
		// invalid (optional)
		// "aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-red-200 aria-[invalid=true]:border-red-500 invalid:ring-2 invalid:ring-red-200 invalid:border-red-500"
	],
	variants: {
		hasError: {
			true: hasErrorInput
		}
	}
});

interface SelectNativeProps
	extends React.InputHTMLAttributes<HTMLSelectElement>,
		VariantProps<typeof selectNativeStyles> {}

const SelectNative = React.forwardRef<HTMLSelectElement, SelectNativeProps>(
	({className, hasError, ...props}: SelectNativeProps, forwardedRef) => {
		return (
			<select
				ref={forwardedRef}
				className={cx(selectNativeStyles({hasError}), className)}
				tremor-id="tremor-raw"
				{...props}
			/>
		);
	}
);

SelectNative.displayName = 'SelectNative';

export {SelectNative, selectNativeStyles, type SelectNativeProps};