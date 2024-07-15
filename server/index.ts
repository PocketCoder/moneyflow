require('dotenv').config();
const express = require('express');
const {PrismaClient} = require('@prisma/client');
const cors = require('cors');
const {auth, requiredScopes} = require('express-oauth2-jwt-bearer');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();
const prisma = new PrismaClient();

// Authorization middleware. When used, the Access Token must
// exist and be verified against the Auth0 JSON Web Key Set.
const checkJwt = auth({
	audience: 'https://moneyflow.110399.xyz',
	issuerBaseURL: `https://moneyflow-cred.eu.auth0.com/`
});

app.use(
	cors({
		origin: process.env.ORIGIN_URL,
		methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
		credentials: true
	})
);

app.use(helmet());
app.use(morgan('tiny'));
app.use(express.json());

app.get('/', (req, res) => {
	res.send('Express on Vercel');
});

// CRUD User //
// CREATE
app.post('/user/', checkJwt, async (req, res) => {
	const currYear = new Date().getFullYear();
	const authID = req.body.sub.split('|')[1];
	try {
		const user = await prisma.users.create({
			data: {
				name: req.body.nickname,
				auth0id: authID,
				preferences: {goal: {[currYear]: 0}}
			}
		});
		res.status(201).json({success: true, user: user});
	} catch (e) {
		res.status(500).json({success: false, error: `Error POST /user: ${e}`});
	}
});

// READ
app.get('/user', checkJwt, async (req, res) => {
	// TODO: 400 error when user not found.
	try {
		const user = await prisma.users.findUnique({
			where: {
				auth0id: req.query.id
			}
		});
		res.status(200).json({success: true, user: user});
	} catch (e) {
		res.status(500).json({success: false, error: `Error GET /user: ${e}`});
	}
});

// UPDATE
app.put('/user', checkJwt, async (req, res) => {
	// TODO: 400 error when user not found.
	// TODO: Validate data.
	try {
		const updateUser = await prisma.user.update({
			where: {
				auth0id: req.query.id
			},
			data: {
				name: req.body.userData.name,
				preferences: req.body.userData.preferences
			}
		});
		res.status(200).json({success: true, user: updateUser});
	} catch (e) {
		res.status(500).json({success: false, error: `Error PUT /user: ${e}`});
	}
});

// DELETE
app.delete('/user', checkJwt, async (req, res) => {
	// TODO: 400 error when user not found.
	try {
		const deleteUser = await prisma.user.delete({
			where: {
				auth0id: req.query.id
			}
		});
		res.status(200).json({success: true});
	} catch (e) {
		res.status(500).json({success: false, error: `Error DELETE /user: ${e}`});
	}
});

// CRUD Accounts //
// CREATE
app.post('/accounts', checkJwt, async (req, res) => {
	// TODO: Validate input data.
	let errors = [];
	let accounts = [];
	for (const a of req.body.accounts) {
		try {
			const dbAcc = await prisma.accounts.create({
				data: {
					owner: req.query.id,
					...a
				}
			});
			accounts.push(dbAcc);
		} catch (e) {
			errors.push({account: a, error: e});
		}
	}

	if (errors.length == 0) {
		res.status(201).json({success: true, data: accounts});
	}
	res.status(500).json({success: false, error: errors});
});

//READ
app.get('/accounts', checkJwt, async (req, res) => {
	if (req.query.includeBals) {
		try {
			const accounts = await prisma.accounts.findMany({
				where: {
					owner: req.query.id
				},
				include: {
					balances: true
				}
			});
			res.status(200).json({success: true, data: accounts});
		} catch (e) {
			res.status(500).json({success: false, error: `Error GET /accounts?includeBals=true: ${e}`});
		}
	} else {
		try {
			const accounts = await prisma.accounts.findMany({
				where: {
					owner: req.query.id
				}
			});
			res.status(200).json(accounts);
		} catch (e) {
			res.status(500).json({success: false, error: `Error GET /accounts?includeBals=false: ${e}`});
		}
	}
});

app.put('/accounts', checkJwt, async (req, res) => {
	// TODO: Validate input data.
	let errors = [];
	let accounts = [];
	for (const a of req.body.accounts) {
		try {
			const dbAcc = await prisma.accounts.update({
				where: {
					owner: req.query.id,
					id: a.id
				},
				data: {
					...a
				}
			});
			accounts.push(dbAcc);
		} catch (e) {
			errors.push({account: a, error: e});
		}
	}

	if (errors.length == 0) {
		res.status(201).json({success: true, data: accounts});
	}
	res.status(201).json({success: false, error: errors});
});

app.delete('/accounts', checkJwt, async (req, res) => {
	try {
		const deleteAccount = await prisma.accounts.delete({
			where: {
				owner: req.query.id,
				id: req.body.account.id
			}
		});
		res.status(200).json({success: true});
	} catch (e) {
		res.status(500).json({success: false, error: `Error DELETE /accounts: ${e}`});
	}
});

// CRUD Balances
// CREATE
app.post('/balances', checkJwt, async (req, res) => {
	let errors = [];
	let balances = [];
	for (const b of req.body.balances) {
		try {
			const dbBal = await prisma.balances.create({
				data: {
					owner: req.query.id,
					...b
				}
			});
			balances.push(dbBal);
		} catch (e) {
			errors.push({balance: b, error: e});
		}
	}

	if (errors.length == 0) {
		res.status(201).json({success: true, data: balances});
	}
	res.status(500).json({success: false, error: errors});
});

app.put('/balances', checkJwt, async (req, res) => {
	// TODO: Validate input data.
	let errors = [];
	let balances = [];
	for (const b of req.body.balances) {
		try {
			const dbBal = await prisma.balances.update({
				where: {
					account: req.query.id,
					id: b.accID
				},
				data: {
					...b
				}
			});
			balances.push(dbBal);
		} catch (e) {
			errors.push({balance: b, error: e});
		}
	}

	if (errors.length == 0) {
		res.status(201).json({success: true, data: balances});
	}
	res.status(201).json({success: false, error: errors});
});

app.delete('/balances', checkJwt, async (req, res) => {
	try {
		const deleteBal = await prisma.balances.delete({
			where: {
				id: req.body.balance.id
			}
		});
		res.status(200).json({success: true});
	} catch (e) {
		res.status(500).json({success: false, error: `Error DELETE /balances: ${e}`});
	}
});

// DELETE THESE WHEN MIGRATED
app.get('/authID/:id', checkJwt, async (req, res) => {
	try {
		const user = await prisma.users.findUnique({
			where: {
				auth0id: req.params.id
			},
			select: {
				id: true,
				name: true,
				auth0id: true,
				preferences: true
			}
		});
		res.status(200).json(user);
	} catch (e) {
		console.error(`Error in /authID/${req.params.id}`);
		console.error(e);
		res.status(500).json({error: 'Internal Server Error'});
	}
});

app.get('/accounts/:id', checkJwt, async (req, res) => {
	try {
		const accounts = await prisma.accounts.findMany({
			where: {
				owner: req.params.id
			},
			include: {
				balances: true
			}
		});
		res.status(200).json(accounts);
	} catch (e) {
		console.error('Error in fetchAccounts(): ' + e);
		res.status(500).json({error: 'Internal Server Error'});
	}
});

// END DELETE

app.post('/preferences', checkJwt, async (req, res) => {
	const body = req.body;
	try {
		const preferences = await prisma.users.update({
			where: {
				id: body.id
			},
			data: {
				preferences: body.newPrefs
			}
		});
		res.status(201).json({success: true});
	} catch (e) {
		res.status(500).json({success: false, error: e});
		throw new Error(`Error updating preferences: ${e}`);
	}
});

app.post('/accounts/:id', checkJwt, async (req, res) => {
	const body = req.body;
	let error;
	for (const a in body) {
		if (body[a] == req.params.id) continue;
		try {
			const account = await prisma.accounts.findFirstOrThrow({
				where: {name: body[a].account, parent: body[a].parent}
			});

			const newBalance = await prisma.balances.create({
				data: {
					account: account.id,
					date: body[a].date,
					amount: body[a].amount
				}
			});
		} catch (e) {
			error = e;
			throw new Error(`Error inserting new balances: ${e}.`);
		}
	}
	if (error) {
		console.log(error);
		res.status(500).json({success: false, error: error});
	}
	res.status(201).json({success: true});
});

app.post('/accounts/add/:id', checkJwt, async (req, res) => {
	if (req.params.id != req.body.id) {
		res.status(500).json({success: false, error: 'IDs do not macth'});
		console.error(`Error: IDs do not match. Params: ${req.params.id} ; Body: ${req.body.id}`);
	}
	const accounts = req.body.accounts;
	let error;
	for (const a in accounts) {
		try {
			const account = await prisma.accounts.create({
				data: {owner: req.body.id, name: accounts[a].name, type: accounts[a].type, parent: accounts[a].parent}
			});
			const bal = parseFloat(accounts[a].balance);
			if (bal) {
				const newBalance = await prisma.balances.create({
					data: {
						account: account.id,
						date: accounts[a].date,
						amount: bal
					}
				});
			} else {
				throw new Error('Balance error is NaN.');
			}
		} catch (e) {
			error = e;
			throw new Error(`Error inserting new balances: ${e}.`);
		}
	}
	if (error) {
		console.log(error);
		res.status(500).json({success: false, error: error});
	}
	res.status(201).json({success: true});
});

app.post('/tags/:id', checkJwt, async (req, res) => {
	try {
		const updateAccount = await prisma.accounts.update({
			where: {
				id: req.body.account.id,
				owner: req.body.user
			},
			data: {
				tags: req.body.account.tags
			}
		});
		console.log(updateAccount);
		res.status(201).json({success: true});
	} catch (err) {
		res.status(500).json({success: false, error: err});
	}
});

app.listen(3000, () => {
	console.log('Server is running on port 3000');
});

process.on('SIGINT', async () => {
	await prisma.$disconnect();
	process.exit();
});

module.exports = app;
