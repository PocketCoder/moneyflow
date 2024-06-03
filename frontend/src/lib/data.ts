export async function fetchAccounts(userID: string, token: string) {
	try {
		const response = await fetch(`${import.meta.env.VITE_SERVER}/accounts/${userID}`, {
			method: 'GET',
			cache: 'default',
			headers: {
				'Content-Type': 'application/json',
				authorization: `Bearer ${token}`
			}
		});

		if (!response.ok) {
			throw new Error(`HTTP error! Status: ${response.status}`);
		}

		const data = await response.json();
		return data;
	} catch (error) {
		// Handle errors
		console.error('Error:', error);
		throw new Error(error);
	}
}

export async function getUserID(authID: string, token: string) {
	try {
		const res = await fetch(`${import.meta.env.VITE_SERVER}/authID/${authID}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				authorization: `Bearer ${token}`
			}
		});

		if (!res.ok) {
			throw new Error(`HTTP error! Status: ${res.status}`);
		}
		const data = await res.json();
		return data;
	} catch (error) {
		// Handle errors
		console.error('Error:', error);
		throw new Error(error);
	}
}

export async function updateAccounts(data: object, token: string) {
	console.log(data);
	try {
		const res = await fetch(`${import.meta.env.VITE_SERVER}/accounts/${data.id}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				authorization: `Bearer ${token}`
			},
			body: JSON.stringify(data)
		});
		const result = await res.json();
		if (!result.success) {
			throw new Error(result.error);
		} else {
			return {success: true};
		}
	} catch (error) {
		// Handle errors
		console.error('Error:', error);
		throw new Error(error);
	}
}

export async function pushNewAccounts(data: object, token: string) {
	try {
		const res = await fetch(`${import.meta.env.VITE_SERVER}/accounts/add/${data.id}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				authorization: `Bearer ${token}`
			},
			body: JSON.stringify(data)
		});
		const result = await res.json();
		if (!result.success) {
			throw new Error(result.error);
		} else {
			return {success: true};
		}
	} catch (error) {
		// Handle errors
		console.error('Error:', error);
		throw new Error(error);
	}
}

export async function pushNewTags(data: {id: string; accountID: string; tags: Array<string>}, token: string) {
	try {
		const res = await fetch(`${import.meta.env.VITE_SERVER}/tags/${data.id}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				authorization: `Bearer ${token}`
			},
			body: JSON.stringify(data)
		});
		const result = await res.json();
		if (!result.success) {
			throw new Error(result.error);
		} else {
			return {success: true};
		}
	} catch (error) {
		console.error('Error:', error);
		throw new Error(error);
	}
}
