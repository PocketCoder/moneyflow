import {Button} from '@/components/Tremor/Button';
import Link from 'next/link';

export default function Add() {
	return (
		<section className="flex items-center gap-4 h-full w-full">
			<Link href={'/add/balance'}>
				<Button className="">Update Balances</Button>
			</Link>
			<Link href={'/add/account'}>
				<Button className="">Add Account</Button>
			</Link>
		</section>
	);
}
