const Transaction = require('../models/Transaction');

exports.createTransaction = async (req, res) => {
    try {
        const { title, amount, type, description, accountId } = req.body;
        const newTransaction = new Transaction({ title, amount, type, description, user: req.user.id, account: accountId, });
        await newTransaction.save();
        res.status(201).json(newTransaction);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.getTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find({user: req.user.id}).sort({ date: -1 }).populate('account', 'title');
        res.json(transactions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
