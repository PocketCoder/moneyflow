// Tremor Input [v1.0.5]
'use client';
import React from 'react';
import {RiEyeFill, RiEyeOffFill, RiSearchLine} from '@remixicon/react';
import {tv, type VariantProps} from 'tailwind-variants';

import {cx, focusInput, focusRing, hasErrorInput} from '@/lib/utils';

const inputStyles = tv({
	base: [
		// base
		'relative block w-full appearance-none rounded-md border px-2.5 py-2 shadow-sm outline-none transition sm:text-sm',
		// border color
		'border-gray-300',
		// text color
		'text-gray-900',
		// placeholder color
		'placeholder-gray-400',
		// background color
		'bg-white',
		// disabled
		'disabled:border-gray-300 disabled:bg-gray-100 disabled:text-gray-400',
		[
			// file
			'file:disabled:bg-gray-100 file:disabled:text-gray-500'
		],
		// focus
		focusInput,
		// invalid (optional)
		// "aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-red-200 aria-[invalid=true]:border-red-500 invalid:ring-2 invalid:ring-red-200 invalid:border-red-500"
		// remove search cancel button (optional)
		'[&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden'
	],
	variants: {
		hasError: {
			true: hasErrorInput
		},
		// number input
		enableStepper: {
			false:
				'[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none'
		}
	}
});

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement>, VariantProps<typeof inputStyles> {
	inputClassName?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
	({className, inputClassName, hasError, enableStepper = true, type, ...props}: InputProps, forwardedRef) => {
		const [typeState, setTypeState] = React.useState(type);

		const isPassword = type === 'password';
		const isSearch = type === 'search';

		return (
			<div className={cx('relative w-full', className)} tremor-id="tremor-raw">
				<input
					ref={forwardedRef}
					type={isPassword ? typeState : type}
					className={cx(
						inputStyles({hasError, enableStepper}),
						{
							'pl-8': isSearch,
							'pr-10': isPassword
						},
						inputClassName
					)}
					{...props}
				/>
				{isSearch && (
					<div
						className={cx(
							// base
							'pointer-events-none absolute bottom-0 left-2 flex h-full items-center justify-center',
							// text color
							'text-gray-400'
						)}>
						<RiSearchLine className="size-[1.125rem] shrink-0" aria-hidden="true" />
					</div>
				)}
				{isPassword && (
					<div className={cx('absolute right-0 bottom-0 flex h-full items-center justify-center px-3')}>
						<button
							aria-label="Change password visibility"
							className={cx(
								// base
								'h-fit w-fit rounded-sm transition-all outline-none',
								// text
								'text-gray-400',
								// hover
								'hover:text-gray-500',
								focusRing
							)}
							type="button"
							onClick={() => {
								setTypeState(typeState === 'password' ? 'text' : 'password');
							}}>
							<span className="sr-only">{typeState === 'password' ? 'Show password' : 'Hide password'}</span>
							{typeState === 'password' ? (
								<RiEyeFill aria-hidden="true" className="size-5 shrink-0" />
							) : (
								<RiEyeOffFill aria-hidden="true" className="size-5 shrink-0" />
							)}
						</button>
					</div>
				)}
			</div>
		);
	}
);

Input.displayName = 'Input';

export {Input, inputStyles, type InputProps};
