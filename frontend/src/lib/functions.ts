import {fetchAccounts, getUserByAuthID, updateAccounts, pushNewAccounts, setUpNewUser, pushNewGoal} from './data';

export function valueFormatter(number: number) {
	return `${new Intl.NumberFormat('en-GB', {style: 'currency', currency: 'GBP'}).format(number).toString()}`;
}

export function transformNetWorthData(data, year) {
	const result = {
		touchable: 0,
		untouchable: 0,
		other: 0
	};
	data.forEach((account) => {
		if (account.years.hasOwnProperty(year) && account.years[year].length > 0) {
			const latestEntry = account.years[year][account.years[year].length - 1];
			const total = parseFloat(latestEntry.amount);
			if (account.name !== 'Net Worth') {
				if (account.tags.includes('touchable')) {
					result['touchable'] += total;
				} else if (account.tags.includes('untouchable')) {
					result['untouchable'] += total;
				} else {
					result['other'] += total;
				}
			}
		}
	});

	const formattedResult = Object.entries(result).map(([name, value]) => ({
		name,
		value
	}));

	let unique: Array<string> = [];
	Object.keys(result).forEach((key) => {
		unique.push(key);
	});
	return {formattedResult, unique};
}

export function dateFormatter(dateString: string) {
	const date = new Date(dateString);
	const options = {year: 'numeric', month: 'short'};
	return date.toLocaleDateString('en-GB', options);
}

export async function fetchUserData(user: any, getAccessTokenSilently: Function, loginWithRedirect: Function) {
	const auth0id = user ? user.sub?.split('|')[1] : '';
	const token = await getAccessTokenSilently().catch(async (e) => {
		console.error(`Token Failed: ${e}`);
		await loginWithRedirect({appState: {returnTo: '/dashboard'}});
	});
	let dbUser = await getUserByAuthID(auth0id, token);
	if (!dbUser) {
		dbUser = await setUpNewUser(user, token);
	}
	const {accountArr, allYears, netWorth} = await getAccountsAndBalances(auth0id, token);
	const uniqueBanks = getUniqueBanks(accountArr);

	return {
		banks: uniqueBanks,
		accounts: accountArr,
		netWorth,
		id: dbUser.id,
		email: user.email,
		authID: auth0id,
		years: allYears,
		prefs: dbUser.preferences
	};
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
	const {id} = await getUserByAuthID(auth0id, token);
	const accountArr = [];
	let netWorth;
	let accounts;
	try {
		accounts = await fetchAccounts(id, token);
	} catch (error) {
		throw new Error(`Error fetching accounts: ${error}`);
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
	} catch (error) {
		throw new Error(`Error fetching accounts: ${error}`);
	}
}

export async function setNewGoal(newGoal, token, userData) {
	const newPreferences = {...userData.prefs};
	const currYear = new Date().getFullYear();
	newPreferences['goal'][currYear] = newGoal;
	const data = {
		id: userData.id,
		newPrefs: newPreferences
	};
	try {
		const result = await pushNewGoal(data, token);
		if (result.success) {
			return result;
		}
	} catch (error) {
		console.error('Error setting goal:', error);
		throw new Error('setGoal: ', error);
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
