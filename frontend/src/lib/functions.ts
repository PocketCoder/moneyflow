import {fetchAccounts, getUserID, updateAccounts, pushNewAccounts} from './data';

export function valueFormatter(number: number) {
	return `${new Intl.NumberFormat('en-GB', {style: 'currency', currency: 'GBP'}).format(number).toString()}`;
}

export function dateFormatter(dateString: string) {
	const date = new Date(dateString);
	const options = {year: 'numeric', month: 'short'};
	return date.toLocaleDateString('en-GB', options);
}

export function calcNetWorthHistory(userData) {
	let historyObj = {};
	for (const a of userData.accounts) {
		if (Object.keys(a.years).length === 0) continue;
		for (const y in a.years) {
			for (const b in a.years[y]) {
				console.log(a.years[y][b]);
				const bal = parseFloat(a.years[y][b]['amount']);
				const date = new Date(a.years[y][b]['date']);
				const dateStr = date.toString();
				if (!Object.hasOwn(historyObj, dateStr)) {
					historyObj[dateStr] = bal;
				} else {
					historyObj[dateStr] += bal;
				}
			}
		}
	}
	console.log(historyObj);
}

export async function getAccountsAndBalances(auth0id: string, token: string) {
	const usrID = await getUserID(auth0id, token);
	const accountArr = [];
	let netWorth;
	let accounts;
	try {
		accounts = await fetchAccounts(usrID, token);
		// Handle the data here
	} catch (error) {
		// Handle errors
		console.error('Error fetching accounts:', error);
	}
	let allYears: string[] = [];
	for (const account of accounts) {
		const balances = account.balances;
		const years = {};
		for (const balance of balances) {
			const date = new Date(balance.date);
			const year = date.getFullYear();
			if (!years[year]) {
				years[year] = [];
			}

			if (!allYears.includes(year.toString())) {
				allYears.push(year.toString());
			}

			years[year].push(balance);
		}
		const item = {
			id: account.id,
			name: account.name,
			type: account.type,
			parent: account.parent,
			tags: account.tags,
			years: years
		};
		if (item.name === 'Net Worth') {
			netWorth = item.years;
		}
		accountArr.push(item);
	}
	return {accountArr, allYears, netWorth};
}

export function getUniqueBanks(accounts) {
	const banks: string[] = [];
	for (const account of accounts) {
		if (!banks.includes(account.parent)) {
			banks.push(account.parent);
		}
	}
	return banks;
}

export function formatDate(dateString) {
	try {
		const date = new Date(dateString);
		const formattedDate = new Intl.DateTimeFormat('en-US', {
			year: 'numeric',
			month: 'short'
		}).format(date);
		return formattedDate;
	} catch (e) {
		console.warn(`formatDate(dateString): dateString: ${dateString}; Error: ${e}`);
		return dateString;
	}
}

export async function pushUpdates(updates, usrData: object, token: string) {
	const netWorthObj = calculateNetWorth(updates, usrData.netWorth);
	const data = {
		id: usrData.id,
		...updates,
		netWorthObj
	};
	try {
		const result = await updateAccounts(data, token);
		if (result.success) {
			return result;
		}
		// Handle the data here
	} catch (error) {
		// Handle errors
		console.error('Error fetching accounts:', error);
	}
}

export async function addNewAccounts(accounts: object[], usrData: object, token: string) {
	// TODO: Add in calculate new net worth
	const data = {
		id: usrData.id,
		accounts: accounts
	};
	try {
		const result = await pushNewAccounts(data, token);
		if (result.success) {
			return result;
		}
		// Handle the data here
	} catch (error) {
		// Handle errors
		console.error('Error adding new accounts:', error);
	}
}

function calculateNetWorth(updates, netWorth) {
	let nw = parseFloat(netWorth);
	for (const a in updates) {
		nw += parseFloat(updates[a].amount);
	}
	console.log(nw);
	return {account: 'Net Worth', parent: 'Net Worth', date: new Date(), amount: nw};
}

export function calcPercDiff(oldValue, newValue) {
	if (oldValue === 0) {
		throw new Error('Cannot divide by zero.');
	}

	const difference = newValue - oldValue;
	const percentageDifference = (difference / Math.abs(oldValue)) * 100;

	return parseFloat(percentageDifference.toFixed(2));
}
