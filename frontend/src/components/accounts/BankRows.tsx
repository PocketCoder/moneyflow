import AccountCard from './AccountCard';
import {Divider} from '@tremor/react';

const BankRows = ({banks, accounts, openModal}) => {
	const sortedBanks = banks.sort((a, b) => a.localeCompare(b));

	return (
		<>
			{sortedBanks.map((bank, index) => (
				<div key={index} className="max-w-full mt-4">
					<Divider>{bank}</Divider>
					<div className="h-fit max-w-full mt-1 px-2 flex flex-nowrap overflow-x-scroll overflow-y-hidden">
						{accounts
							.filter((account) => account.parent === bank)
							.map((account, accIndex) =>
								account.tags.includes('inactive') ? (
									<></>
								) : (
									<div className="mx-2 first:ml-0" key={accIndex} onClick={() => openModal(account)}>
										<AccountCard account={account} />
									</div>
								)
							)}
					</div>
				</div>
			))}
		</>
	);
};

export default BankRows;
