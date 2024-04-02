import AccountCard from './AccountCard';
import Divider from './Divider';

const BankRows = ({banks, accounts, openModal}) => {
	const sortedBanks = banks.sort((a, b) => a.localeCompare(b));
	const bankTotals = {};

	for (const account of accounts) {
		const bank = account.parent;
		bankTotals[bank] === undefined
			? (bankTotals[bank] = Number(account.balance))
			: (bankTotals[bank] += Number(account.balance));
	}

	const formatAmount = (num: number) =>
		new Intl.NumberFormat('en-GB', {minimumSignificantDigits: 2, maximumSignificantDigits: 2}).format(num).toString();

	return (
		<>
			{sortedBanks.map((bank, index) => (
				<div key={index} className="max-w-full mt-4">
					<Divider key={bank + '_' + index} word={bank} balance={formatAmount(bankTotals[bank])} />
					<div className="h-fit max-w-full mt-1 px-2 flex flex-nowrap overflow-x-scroll overflow-y-hidden">
						{accounts
							.filter((account) => account.parent === bank)
							.map((account, accIndex) => (
								<div className="mx-2 first:ml-0" key={accIndex} onClick={() => openModal(account)}>
									<AccountCard account={account} />
								</div>
							))}
					</div>
				</div>
			))}
		</>
	);
};

export default BankRows;
