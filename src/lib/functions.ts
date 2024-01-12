import {fetchAccounts, fetchBalances} from './data';

export async function mergeAccountsAndBalances() {
	let ret = [];
	const envUSER = import.meta.env.USERID;
	const accounts = await fetchAccounts(envUSER);
	for (const account of accounts) {
		let balances = await fetchBalances(account.id);
		let recentBalance;
		if (balances.length == 0) {
			recentBalance = 0;
		} else {
			balances.sort((a, b) => new Date(b.date) - new Date(a.date));
			recentBalance = balances[0].balance;
		}

		const item = {
			name: account.name,
			type: account.type,
			parent: account.parent,
			balance: recentBalance,
			balanceHistory: balances
		};
		ret.push(item);
	}
	return ret;
}

export function getUniqueBanks(accounts) {
	let banks: string[] = [];
	for (const account of accounts) {
		if (!banks.includes(account.parent)) {
			banks.push(account.parent);
		}
	}
	return banks;
}

export function sumNetWorth(accounts) {
	let netWorth = 0;
	for (const account of accounts) {
		account.type === 'Debt' ? (netWorth -= Number(account.balance)) : (netWorth += Number(account.balance));
	}
	return netWorth;
}

export function formatDate(dateString) {
	const date = new Date(dateString);
	const formattedDate = new Intl.DateTimeFormat('en-US', {
		year: 'numeric',
		month: 'short'
	}).format(date);

	return formattedDate;
}

export function history(accounts) {
	let netWorth: {date: string; balance: number} = {};
	for (let a of accounts) {
		if (a.name === 'Mum ISA') break;
		if (a.name === 'Deposit (2, 324, W9 3EF)') break;
		// TODO: Add in constants for these values as they didn't change throughout the year so there's only one entry.
		for (let b of a.balanceHistory) {
			if (b.date == undefined) {
				console.log(b);
				break;
			}
			const month = new Date(b.date).getMonth() + 1;
			const year = new Date(b.date).getFullYear();
			const fullDate = `${month}/${year}`;
			const balance = parseFloat(b.balance);
			if (isNaN(balance)) {
				console.error(`Invalid balance for date ${jDate}: ${b.balance}`);
				return;
			}
			if (netWorth[fullDate] === undefined) {
				netWorth[fullDate] = balance;
			} else {
				netWorth[fullDate] += balance;
			}
		}
	}
	// FIXME: Net Worth isn't correct at the end.
	console.log(netWorth);
}
