const Transaction = require('../models/Transaction');

// GET /transactions
exports.getTransactions = async (req, res) => {
    try {
        const transactions = await Transaction
            .find({user: req.user.id})
            .sort({date: -1})
            .populate('account', 'title');
        res.json(transactions);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
};

// POST /transactions
exports.createTransaction = async (req, res) => {
    try {
        const {title, amount, type, description, accountId} = req.body;
        const newTransaction = new Transaction({
            title,
            amount,
            type,
            description,
            user: req.user.id,
            account: accountId,
        });
        await newTransaction.save();
        res.status(201).json(newTransaction);
    } catch (err) {
        res.status(400).json({error: err.message});
    }
};

// PUT /transactions/:id
exports.updateTransaction = async (req, res) => {
    const {id} = req.params;
    const {title, amount, type, description, accountId} = req.body;

    try {
        const transaction = await Transaction.findOneAndUpdate(
            {_id: id},
            {title, amount, type, description},
            {new: true}
        );
        if (!transaction)
            return res.status(404).json({error: 'Transaction not found'});
        res.json(transaction);
    } catch (err) {
        res.status(500).json({
            message: 'Failed to update transaction',
            error: err.message,
        });
    }
};

// DELETE /transactions/:id
exports.deleteTransaction = async (req, res) => {
    const {id} = req.params;

    try {
        const transaction = await Transaction.findOneAndDelete({_id: id});
        if (!transaction)
            return res.status(404).json({error: 'Transaction not found'});
        res.json(transaction);
    } catch (err) {
        res.status(500).json({
            message: 'Failed to delete transaction',
            error: err.message,
        });
    }
};
