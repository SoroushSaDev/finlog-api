const Account = require('../models/Account');
const Transaction = require('../models/Transaction');

// GET /accounts
exports.getAccounts = async (req, res) => {
    try {
        const accounts = await Account.find({user: req.user.id});
        res.json(accounts);
    } catch (err) {
        res.status(500).json({
            message: 'Failed to fetch accounts',
            error: err.message,
        });
    }
};

// POST /accounts
exports.createAccount = async (req, res) => {
    const {title, description, owner, bank, number, card, sheba} = req.body;

    if (!title) return res.status(400).json({error: 'Title is required'});

    try {
        const account = await Account.create({
            title,
            description,
            owner,
            bank,
            number,
            card,
            sheba,
            user: req.user.id
        });
        res.status(201).json(account);
    } catch (err) {
        res.status(500).json({
            message: 'Failed to create account',
            error: err.message,
        });
    }
};

// PUT /accounts/:id
exports.updateAccount = async (req, res) => {
    const {id} = req.params;
    const {title, description, owner, bank, number, card, sheba} = req.body;

    try {
        const account = await Account.findOneAndUpdate(
            {_id: id, user: req.user.id},
            {
                title,
                description,
                owner,
                bank,
                number,
                card,
                sheba,
            },
            {new: true},
        );
        if (!account)
            return res.status(404).json({error: 'Account not found'});
        res.json(account);
    } catch (err) {
        res.status(500).json({
            message: 'Failed to update account',
            error: err.message,
        });
    }
};

// DELETE /accounts/:id
exports.deleteAccount = async (req, res) => {
    const {id} = req.params;

    try {
        const account = await Account.findOneAndDelete({_id: id, user: req.user.id});
        if (!account) return res.status(404).json({error: 'Account not found'});
        res.json(account);
    } catch (err) {
        res.status(500).json({
            message: 'Failed to delete account',
            error: err.message,
        });
    }
};

// GET /accounts/all
exports.getAllAccounts = async (req, res) => {
    try {
        const accounts = await Account.find().populate('user', 'name email')
        res.json(accounts)
    } catch (err) {
        res.status(500).json({
            message: 'Failed to fetch accounts',
            error: err.message,
        })
    }
};

//
exports.getBalance = async (req, res) => {
    try {
        const {id} = req.params;
        const transactions = await Transaction.find({account: id});
        const balance = transactions.reduce((acc, transaction) => {
            return transaction.type === 'income'
                ? acc + transaction.amount
                : acc - transaction.amount;
        }, 0);
        res.json({balance});
    } catch (err) {
        res.status(500).json({error: err.message});
    }
};

//
exports.getTransactions = async (req, res) => {
    try {
        const {id} = req.params;
        const transactions = await Transaction.find({account: id}).sort({date: -1}).populate('user', 'name');
        res.json(transactions);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
};
