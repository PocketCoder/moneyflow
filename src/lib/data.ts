export const banks = [
	{value: 'barclays', label: 'Barclays', icon: '/bank-logos/barclays.svg'},
	{value: 'chase', label: 'Chase', icon: '/bank-logos/chase.svg'},
	{value: 'chip', label: 'Chip', icon: '/bank-logos/chip.svg'},
	{value: 'gov_uk', label: 'GOV.UK', icon: '/bank-logos/gov_uk.png'},
	{value: 'lloyds', label: 'Lloyds', icon: '/bank-logos/lloyds.svg'},
	{value: 'moneybox', label: 'Moneybox', icon: '/bank-logos/moneybox.svg'},
	{value: 'monzo', label: 'Monzo', icon: '/bank-logos/monzo.png'},
	{value: 'plum', label: 'Plum', icon: '/bank-logos/plum.svg'},
	{value: 'santander', label: 'Santander', icon: '/bank-logos/santander.svg'},
	{value: 'scottish_widows', label: 'Scottish Widows', icon: '/bank-logos/scottish_widows.svg'},
	{value: 'vanguard', label: 'Vanguard', icon: '/bank-logos/vanguard.svg'},
	{value: 'ybs', label: 'YBS', icon: '/bank-logos/ybs.svg'},
	{value: 'trading_212', label: 'Trading 212', icon: '/bank-logos/t212-black.svg'}
];

export const types = [
	// Everyday banking
	'Current Account',
	'Packaged Current Account',
	'Basic Bank Account',
	'Student Bank Account',
	'Joint Account',
	'Business Bank Account',
	'Pot',

	// Savings structures
	'Savings Account',
	'Easy Access Savings Account',
	'Regular Saver',
	'Fixed Rate Bond',
	'Notice Account',
	'Passbook Savings Account',
	'Children’s Savings Account',

	// ISAs (tax-free wrappers)
	'Cash ISA',
	'Stocks and Shares ISA',
	'Innovative Finance ISA',
	'Lifetime ISA',
	'Junior ISA',

	// Investments
	'General Investment Account',
	//'Investment Trust Account',
	//'Unit Trust / OEIC Account',
	//'Structured Investment Account',

	// Retirement / decumulation
	'Personal Pension',
	'Workplace Pension',
	'Self-Invested Personal Pension (SIPP)',
	//'Income Drawdown Account',
	//'Investment-Linked Annuity',

	// Insurance-based financial accounts
	//'Cash Value Insurance Contract',
	//'Annuity Contract',

	// Specialist / organisational
	///'Client Account',
	//'Charity Account',
	'Foreign Currency Account',
	'Multi-Currency Account'
];
