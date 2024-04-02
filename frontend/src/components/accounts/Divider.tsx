import {Divider} from '@tremor/react';

export default function BankDivider({word, balance}) {
	return (
		<Divider>
			{word} &bull; £{balance}
		</Divider>
	);
}
