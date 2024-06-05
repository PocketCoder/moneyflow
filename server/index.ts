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
		origin: 'http://localhost:5173',
		methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
		credentials: true
	})
);

app.use(helmet());
app.use(morgan('tiny'));
app.use(express.json());

app.get('/authID/:id', checkJwt, async (req, res) => {
	try {
		const id = await prisma.users.findUnique({
			where: {
				auth0id: req.params.id
			}
		});
		res.status(200).json(id.id);
	} catch (e) {
		console.error(`Error in /authID/${req.params.id}`);
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
			const date = new Date();
			const bal = parseFloat(accounts[a].balance);
			if (bal) {
				const newBalance = await prisma.balances.create({
					data: {
						account: account.id,
						date: date,
						amount: bal
					}
				});
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
				id: req.body.accountID,
				owner: req.body.id
			},
			data: {
				tags: req.body.tags
			}
		});
		console.log(updateAccount);
	} catch (err) {
		res.status(500).json({success: false, error: err});
	}
	res.status(201).json({success: true});
});

app.listen(3000, () => {
	console.log('Server is running on port 3000');
});

process.on('SIGINT', async () => {
	await prisma.$disconnect();
	process.exit();
});
