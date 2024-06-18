'use strict';
require('dotenv').config();
const express = require('express');
const {PrismaClient} = require('@prisma/client');
const cors = require('cors');
const {auth, requiredScopes} = require('express-oauth2-jwt-bearer');
const helmet = require('helmet');
const morgan = require('morgan');
const app = express();
const prisma = new PrismaClient();
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
app.post('/preferences', checkJwt, async (req, res) => {
	const body = req.body;
	try {
		const goal = await prisma.users.update({
			where: {
				id: body.user
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
